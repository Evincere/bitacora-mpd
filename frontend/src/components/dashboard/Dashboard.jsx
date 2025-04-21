import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * Componente de dashboard
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    activityCountByStatus: [],
    activityCountByType: [],
    recentActivities: [],
    totalActivities: 0,
    pendingActivities: 0,
    completedActivities: 0
  });

  // Colores para los gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  /**
   * Carga los datos del dashboard
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Verificar si el usuario está autenticado
        const token = localStorage.getItem(config.auth.tokenKey);
        if (!token) {
          // Por ahora, solo usamos datos de prueba sin redireccionar
          // En una implementación real, redirigiríamos a login
          // navigate('/login');
          // return;
        }

        // En una implementación real, haríamos una petición a la API
        // const response = await axios.get(`${config.apiUrl}/dashboard/stats`);
        // setStats(response.data);

        // Por ahora, simulamos la carga de datos
        setTimeout(() => {
          const mockData = {
            activityCountByStatus: [
              { name: 'Pendiente', value: 12 },
              { name: 'En Progreso', value: 8 },
              { name: 'Completada', value: 20 },
              { name: 'Cancelada', value: 3 }
            ],
            activityCountByType: [
              { name: 'Reunión', value: 15 },
              { name: 'Llamada', value: 10 },
              { name: 'Visita', value: 8 },
              { name: 'Documento', value: 7 },
              { name: 'Otro', value: 3 }
            ],
            recentActivities: [
              { id: 1, type: 'Reunión', description: 'Reunión con equipo técnico', date: '2025-04-15', status: 'Completada' },
              { id: 2, type: 'Llamada', description: 'Llamada con cliente', date: '2025-04-16', status: 'Pendiente' },
              { id: 3, type: 'Documento', description: 'Revisión de contrato', date: '2025-04-17', status: 'En Progreso' }
            ],
            totalActivities: 43,
            pendingActivities: 12,
            completedActivities: 20
          };

          setStats(mockData);
          setLoading(false);
        }, 1500);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('Error al cargar los datos del dashboard');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e3f2fd'
            }}
          >
            <Typography variant="h6" color="textSecondary">
              Total de Actividades
            </Typography>
            <Typography component="p" variant="h3" sx={{ mt: 2 }}>
              {stats.totalActivities}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#fff8e1'
            }}
          >
            <Typography variant="h6" color="textSecondary">
              Actividades Pendientes
            </Typography>
            <Typography component="p" variant="h3" sx={{ mt: 2 }}>
              {stats.pendingActivities}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e8f5e9'
            }}
          >
            <Typography variant="h6" color="textSecondary">
              Actividades Completadas
            </Typography>
            <Typography component="p" variant="h3" sx={{ mt: 2 }}>
              {stats.completedActivities}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Actividades por Estado" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.activityCountByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.activityCountByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Actividades por Tipo" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stats.activityCountByType}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actividades recientes */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Actividades Recientes" />
            <CardContent>
              {stats.recentActivities.length > 0 ? (
                <Box>
                  {stats.recentActivities.map((activity) => (
                    <Paper
                      key={activity.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { sm: 'center' },
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1">{activity.description}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {activity.type} - {activity.date}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          mt: { xs: 1, sm: 0 },
                          bgcolor:
                            activity.status === 'Completada' ? '#e8f5e9' :
                            activity.status === 'Pendiente' ? '#fff8e1' :
                            activity.status === 'En Progreso' ? '#e3f2fd' : '#ffebee',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2">{activity.status}</Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1">No hay actividades recientes</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
