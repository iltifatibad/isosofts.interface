import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'http://localhost:8000';

const KPIDashboard = () => {
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/dashboard/kpi/all?status=active");
        if (!response.ok) {
          throw new Error('Failed to fetch KPI data');
        }
        const data = await response.json();
        setKpiData(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKpiData();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100vh', width: '100vw' }}><div style={{ textAlign: 'right' }}>Loading...</div></div>;
  if (error) return <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100vh', width: '100vw' }}><div style={{ textAlign: 'right' }}>Error: {error}</div></div>;

  // Sample data for the new chart - replace with your actual data
  const chartData = [
    {
      name: 'BR',
      totalActions: 45,
      closedActions: 30,
      closureRate: 66.7
    },
    {
      name: 'OR',
      totalActions: 38,
      closedActions: 25,
      closureRate: 65.8
    },
    {
      name: 'CR',
      totalActions: 52,
      closedActions: 40,
      closureRate: 76.9
    },
    // Add 12 more items to reach 15 total
  ];

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f2f5', 
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end'
    }}>
      <h1 style={{ 
        textAlign: 'right',
        color: '#333', 
        marginBottom: '30px', 
        fontSize: '2.5rem', 
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        width: '100%',
        paddingRight: '20px'
      }}>KPI Dashboard</h1>
      
      <div style={{ 
        width: '95%',
        height: '600px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        padding: '20px'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 80, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            
            {/* Sol Y ekseni - Sayılar (0, 20, 40...) */}
            <YAxis 
              yAxisId="left"
              orientation="left"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              stroke="#333"
            />
            
            {/* Sağ Y ekseni - Yüzdeler (0%, 20%, 40%...) */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              tickFormatter={(value) => `${value}%`}
              stroke="#333"
            />
            
            <XAxis dataKey="name" stroke="#333" />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}
            />
            
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            
            {/* Total # of Actions - Mavi */}
            <Bar 
              yAxisId="left"
              dataKey="totalActions" 
              fill="#2196F3" 
              name="Total # of Actions"
              radius={[8, 8, 0, 0]}
            />
            
            {/* Number of Closed Actions - Orange */}
            <Bar 
              yAxisId="left"
              dataKey="closedActions" 
              fill="#FF9800" 
              name="Number of Closed Actions"
              radius={[8, 8, 0, 0]}
            />
            
            {/* Closure Rate - Gri */}
            <Bar 
              yAxisId="right"
              dataKey="closureRate" 
              fill="#9E9E9E" 
              name="Closure Rate (%)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default KPIDashboard;