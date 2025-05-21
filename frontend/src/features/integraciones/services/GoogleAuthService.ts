import api from '@/utils/api-ky';

/**
 * Interfaz para la configuración de autenticación de Google
 */
export interface GoogleAuthConfig {
  clientId: string;
  apiKey: string;
  scopes: string[];
  discoveryDocs: string[];
}

/**
 * Servicio para la autenticación con Google
 */
class GoogleAuthService {
  private isInitialized = false;
  private isLoading = false;
  private authInstance: any = null;
  private config: GoogleAuthConfig | null = null;

  /**
   * Inicializa el servicio de autenticación de Google
   * @param config Configuración de autenticación
   * @returns Promise<void>
   */
  async initialize(config: GoogleAuthConfig): Promise<void> {
    if (this.isInitialized || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.config = config;

    try {
      // Cargar la API de Google
      await this.loadGoogleApi();
      
      // Inicializar la API de autenticación
      await this.initGoogleAuth();
      
      this.isInitialized = true;
      console.log('Google Auth Service inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar Google Auth Service:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Carga la API de Google
   * @returns Promise<void>
   */
  private loadGoogleApi(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Verificar si el script ya está cargado
      if (window.gapi) {
        resolve();
        return;
      }

      // Crear script para cargar la API de Google
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Error al cargar la API de Google'));
      document.head.appendChild(script);
    });
  }

  /**
   * Inicializa la API de autenticación de Google
   * @returns Promise<void>
   */
  private initGoogleAuth(): Promise<void> {
    if (!this.config) {
      return Promise.reject(new Error('La configuración de autenticación no está definida'));
    }

    return new Promise((resolve, reject) => {
      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init({
            apiKey: this.config!.apiKey,
            clientId: this.config!.clientId,
            discoveryDocs: this.config!.discoveryDocs,
            scope: this.config!.scopes.join(' ')
          });
          
          this.authInstance = window.gapi.auth2.getAuthInstance();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns boolean
   */
  isAuthenticated(): boolean {
    if (!this.isInitialized || !this.authInstance) {
      return false;
    }
    
    return this.authInstance.isSignedIn.get();
  }

  /**
   * Inicia sesión con Google
   * @returns Promise<void>
   */
  async signIn(): Promise<void> {
    if (!this.isInitialized || !this.authInstance) {
      throw new Error('El servicio de autenticación no está inicializado');
    }
    
    try {
      await this.authInstance.signIn();
      
      // Obtener el token de acceso y enviarlo al backend
      const token = this.getAccessToken();
      if (token) {
        await this.sendTokenToBackend(token);
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    }
  }

  /**
   * Cierra sesión con Google
   * @returns Promise<void>
   */
  async signOut(): Promise<void> {
    if (!this.isInitialized || !this.authInstance) {
      throw new Error('El servicio de autenticación no está inicializado');
    }
    
    try {
      await this.authInstance.signOut();
      await this.revokeTokenOnBackend();
    } catch (error) {
      console.error('Error al cerrar sesión con Google:', error);
      throw error;
    }
  }

  /**
   * Obtiene el token de acceso actual
   * @returns string | null
   */
  getAccessToken(): string | null {
    if (!this.isInitialized || !this.authInstance) {
      return null;
    }
    
    const user = this.authInstance.currentUser.get();
    if (!user) {
      return null;
    }
    
    const authResponse = user.getAuthResponse();
    return authResponse ? authResponse.access_token : null;
  }

  /**
   * Obtiene el usuario actual
   * @returns any | null
   */
  getCurrentUser(): any | null {
    if (!this.isInitialized || !this.authInstance) {
      return null;
    }
    
    const user = this.authInstance.currentUser.get();
    if (!user) {
      return null;
    }
    
    const profile = user.getBasicProfile();
    return {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl()
    };
  }

  /**
   * Envía el token de acceso al backend
   * @param token Token de acceso
   * @returns Promise<void>
   */
  private async sendTokenToBackend(token: string): Promise<void> {
    try {
      await api.post('integrations/google/auth', {
        json: { token }
      });
    } catch (error) {
      console.error('Error al enviar el token al backend:', error);
      throw error;
    }
  }

  /**
   * Revoca el token en el backend
   * @returns Promise<void>
   */
  private async revokeTokenOnBackend(): Promise<void> {
    try {
      await api.delete('integrations/google/auth');
    } catch (error) {
      console.error('Error al revocar el token en el backend:', error);
      throw error;
    }
  }
}

// Declaración global para TypeScript
declare global {
  interface Window {
    gapi: any;
  }
}

// Exportar una instancia del servicio
export const googleAuthService = new GoogleAuthService();
