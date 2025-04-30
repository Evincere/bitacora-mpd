import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TaskRequestStats } from '../../types/TaskRequest';
import { taskRequestService } from '../../services/taskRequestService';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

const TaskRequestStatsComponent: React.FC = () => {
  const [stats, setStats] = useState<TaskRequestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskRequestService.getStatsByStatus();
      setStats(response);
    } catch (err) {
      console.error('Error al cargar las estadísticas:', err);
      setError('Error al cargar las estadísticas. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getStatusName = (status: string): string => {
    switch (status) {
      case 'DRAFT':
        return 'Borrador';
      case 'SUBMITTED':
        return 'Enviada';
      case 'ASSIGNED':
        return 'Asignada';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const prepareChartData = () => {
    if (!stats) return [];
    
    return Object.entries(stats).map(([status, count]) => ({
      name: getStatusName(status),
      value: count,
      status
    }));
  };

  const chartData = prepareChartData();
  const totalRequests = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Estadísticas de Solicitudes
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resumen
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {totalRequests}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Solicitudes totales
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    {chartData.map((item, index) => (
                      <Grid item xs={6} sm={4} md={2.4} key={item.status}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h5" color="text.primary">
                            {item.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.name}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Solicitudes por Estado (Gráfico de Barras)
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} solicitudes`, 'Cantidad']} />
                    <Legend />
                    <Bar dataKey="value" name="Cantidad" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Solicitudes por Estado (Gráfico Circular)
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} solicitudes`, 'Cantidad']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default TaskRequestStatsComponent;
