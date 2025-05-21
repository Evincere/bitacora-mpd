import api from '@/utils/api-ky';
import { googleAuthService } from './GoogleAuthService';
import { 
  DriveIntegrationService, 
  DriveFile, 
  DriveFolder, 
  DriveIntegrationConfig 
} from './DriveIntegrationService';

/**
 * Implementación real del servicio de integración con Google Drive
 */
export class RealDriveIntegrationService implements DriveIntegrationService {
  private config: DriveIntegrationConfig = {
    rootFolderId: 'root',
    createActivityFolders: true,
    organizeFoldersByType: true,
    defaultPermissions: 'private',
    autoSync: false,
    syncFrequency: 60
  };

  /**
   * Inicializa el servicio de integración con Google Drive
   * @returns Promise<void>
   */
  async initialize(): Promise<void> {
    try {
      // Inicializar el servicio de autenticación de Google
      await googleAuthService.initialize({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY || '',
        scopes: [
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/drive.appdata'
        ],
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
        ]
      });

      // Cargar la configuración desde el backend si el usuario está autenticado
      if (await this.isAuthenticated()) {
        await this.loadConfig();
      }
    } catch (error) {
      console.error('Error al inicializar el servicio de integración con Google Drive:', error);
      throw error;
    }
  }

  /**
   * Verifica si el usuario está autenticado con Google Drive
   * @returns Promise<boolean>
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      // Verificar si el usuario está autenticado con Google
      const isGoogleAuthenticated = googleAuthService.isAuthenticated();
      
      if (!isGoogleAuthenticated) {
        return false;
      }
      
      // Verificar si el token está registrado en el backend
      const response = await api.get('integrations/google/drive/status').json<{ authenticated: boolean }>();
      return response.authenticated;
    } catch (error) {
      console.error('Error al verificar la autenticación con Google Drive:', error);
      return false;
    }
  }

  /**
   * Inicia el flujo de autenticación con Google Drive
   * @returns Promise<void>
   */
  async authenticate(): Promise<void> {
    try {
      // Iniciar sesión con Google
      await googleAuthService.signIn();
      
      // Verificar si la autenticación fue exitosa
      if (!googleAuthService.isAuthenticated()) {
        throw new Error('La autenticación con Google falló');
      }
      
      // Cargar la configuración desde el backend
      await this.loadConfig();
    } catch (error) {
      console.error('Error al autenticar con Google Drive:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión con Google Drive
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    try {
      await googleAuthService.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión con Google Drive:', error);
      throw error;
    }
  }

  /**
   * Sube un archivo a Google Drive
   * @param file Archivo a subir
   * @param folderId ID de la carpeta donde se subirá el archivo (opcional)
   * @param activityId ID de la actividad relacionada (opcional)
   * @returns Promise<DriveFile>
   */
  async uploadFile(file: File, folderId?: string, activityId?: number): Promise<DriveFile> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const metadata = {
        name: file.name,
        mimeType: file.type,
        parents: folderId ? [folderId] : [this.config.rootFolderId],
        appProperties: activityId ? { activityId: activityId.toString() } : undefined
      };
      
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);
      
      const accessToken = googleAuthService.getAccessToken();
      
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: form
      });
      
      if (!response.ok) {
        throw new Error(`Error al subir archivo: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Obtener información completa del archivo
      return this.getFileInfo(result.id);
    } catch (error) {
      console.error('Error al subir archivo a Google Drive:', error);
      throw error;
    }
  }

  /**
   * Descarga un archivo de Google Drive
   * @param fileId ID del archivo a descargar
   * @returns Promise<Blob>
   */
  async downloadFile(fileId: string): Promise<Blob> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const accessToken = googleAuthService.getAccessToken();
      
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error al descargar archivo: ${response.statusText}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Error al descargar archivo de Google Drive:', error);
      throw error;
    }
  }

  /**
   * Elimina un archivo de Google Drive
   * @param fileId ID del archivo a eliminar
   * @returns Promise<void>
   */
  async deleteFile(fileId: string): Promise<void> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      await window.gapi.client.drive.files.delete({
        fileId: fileId
      });
    } catch (error) {
      console.error('Error al eliminar archivo de Google Drive:', error);
      throw error;
    }
  }

  /**
   * Obtiene información de un archivo
   * @param fileId ID del archivo
   * @returns Promise<DriveFile>
   */
  async getFileInfo(fileId: string): Promise<DriveFile> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const response = await window.gapi.client.drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, size, webViewLink, webContentLink, iconLink, createdTime, modifiedTime, parents, appProperties'
      });
      
      const file = response.result;
      
      return {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: parseInt(file.size),
        webViewLink: file.webViewLink,
        webContentLink: file.webContentLink,
        iconLink: file.iconLink,
        createdTime: new Date(file.createdTime),
        modifiedTime: new Date(file.modifiedTime),
        activityId: file.appProperties?.activityId ? parseInt(file.appProperties.activityId) : undefined,
        folderId: file.parents ? file.parents[0] : undefined
      };
    } catch (error) {
      console.error('Error al obtener información del archivo de Google Drive:', error);
      throw error;
    }
  }

  /**
   * Crea una carpeta en Google Drive
   * @param name Nombre de la carpeta
   * @param parentId ID de la carpeta padre (opcional)
   * @returns Promise<DriveFolder>
   */
  async createFolder(name: string, parentId?: string): Promise<DriveFolder> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const metadata = {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : [this.config.rootFolderId]
      };
      
      const response = await window.gapi.client.drive.files.create({
        resource: metadata,
        fields: 'id, name, parents'
      });
      
      const folder = response.result;
      
      return {
        id: folder.id,
        name: folder.name,
        parentId: folder.parents ? folder.parents[0] : undefined
      };
    } catch (error) {
      console.error('Error al crear carpeta en Google Drive:', error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de archivos en una carpeta
   * @param folderId ID de la carpeta
   * @returns Promise<DriveFile[]>
   */
  async listFiles(folderId: string): Promise<DriveFile[]> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const response = await window.gapi.client.drive.files.list({
        q: `'${folderId}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
        fields: 'files(id, name, mimeType, size, webViewLink, webContentLink, iconLink, createdTime, modifiedTime, parents, appProperties)'
      });
      
      return response.result.files.map((file: any) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: parseInt(file.size),
        webViewLink: file.webViewLink,
        webContentLink: file.webContentLink,
        iconLink: file.iconLink,
        createdTime: new Date(file.createdTime),
        modifiedTime: new Date(file.modifiedTime),
        activityId: file.appProperties?.activityId ? parseInt(file.appProperties.activityId) : undefined,
        folderId: file.parents ? file.parents[0] : undefined
      }));
    } catch (error) {
      console.error('Error al listar archivos de Google Drive:', error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de carpetas
   * @param parentId ID de la carpeta padre (opcional)
   * @returns Promise<DriveFolder[]>
   */
  async listFolders(parentId?: string): Promise<DriveFolder[]> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const query = parentId 
        ? `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
        : `mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
      
      const response = await window.gapi.client.drive.files.list({
        q: query,
        fields: 'files(id, name, parents)'
      });
      
      return response.result.files.map((folder: any) => ({
        id: folder.id,
        name: folder.name,
        parentId: folder.parents ? folder.parents[0] : undefined
      }));
    } catch (error) {
      console.error('Error al listar carpetas de Google Drive:', error);
      throw error;
    }
  }

  /**
   * Busca archivos por nombre o contenido
   * @param query Texto a buscar
   * @returns Promise<DriveFile[]>
   */
  async searchFiles(query: string): Promise<DriveFile[]> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const response = await window.gapi.client.drive.files.list({
        q: `fullText contains '${query}' and trashed = false`,
        fields: 'files(id, name, mimeType, size, webViewLink, webContentLink, iconLink, createdTime, modifiedTime, parents, appProperties)'
      });
      
      return response.result.files.map((file: any) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: parseInt(file.size),
        webViewLink: file.webViewLink,
        webContentLink: file.webContentLink,
        iconLink: file.iconLink,
        createdTime: new Date(file.createdTime),
        modifiedTime: new Date(file.modifiedTime),
        activityId: file.appProperties?.activityId ? parseInt(file.appProperties.activityId) : undefined,
        folderId: file.parents ? file.parents[0] : undefined
      }));
    } catch (error) {
      console.error('Error al buscar archivos en Google Drive:', error);
      throw error;
    }
  }

  /**
   * Comparte un archivo con otros usuarios
   * @param fileId ID del archivo a compartir
   * @param emails Correos electrónicos de los usuarios con los que se compartirá
   * @param permission Tipo de permiso ('view' o 'edit')
   * @returns Promise<void>
   */
  async shareFile(fileId: string, emails: string[], permission: 'view' | 'edit'): Promise<void> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const role = permission === 'view' ? 'reader' : 'writer';
      
      for (const email of emails) {
        await window.gapi.client.drive.permissions.create({
          fileId: fileId,
          sendNotificationEmail: true,
          resource: {
            type: 'user',
            role: role,
            emailAddress: email
          }
        });
      }
    } catch (error) {
      console.error('Error al compartir archivo en Google Drive:', error);
      throw error;
    }
  }

  /**
   * Obtiene la configuración actual de la integración
   * @returns Promise<DriveIntegrationConfig>
   */
  async getConfig(): Promise<DriveIntegrationConfig> {
    return this.config;
  }

  /**
   * Actualiza la configuración de la integración
   * @param config Nueva configuración
   * @returns Promise<void>
   */
  async updateConfig(config: DriveIntegrationConfig): Promise<void> {
    try {
      await api.put('integrations/google/drive/config', {
        json: config
      });
      
      this.config = config;
    } catch (error) {
      console.error('Error al actualizar la configuración de Google Drive:', error);
      throw error;
    }
  }

  /**
   * Sincroniza archivos entre la aplicación y Google Drive
   * @param activityId ID de la actividad a sincronizar (opcional)
   * @returns Promise<{uploaded: number, downloaded: number, deleted: number}>
   */
  async syncFiles(activityId?: number): Promise<{uploaded: number, downloaded: number, deleted: number}> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const response = await api.post('integrations/google/drive/sync', {
        json: { activityId }
      }).json<{uploaded: number, downloaded: number, deleted: number}>();
      
      return response;
    } catch (error) {
      console.error('Error al sincronizar archivos con Google Drive:', error);
      throw error;
    }
  }

  /**
   * Carga la configuración desde el backend
   * @returns Promise<void>
   */
  private async loadConfig(): Promise<void> {
    try {
      const config = await api.get('integrations/google/drive/config').json<DriveIntegrationConfig>();
      this.config = config;
    } catch (error) {
      console.error('Error al cargar la configuración de Google Drive:', error);
      // Usar la configuración por defecto
    }
  }
}

// Exportar una instancia del servicio
export const realDriveIntegrationService = new RealDriveIntegrationService();
