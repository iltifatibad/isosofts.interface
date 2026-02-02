import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

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

  if (loading) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      marginLeft: '250px',
      fontSize: '1.5rem',
      color: '#666'
    }}>
      Loading...
    </div>
  );
  
  if (error) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      marginLeft: '250px',
      fontSize: '1.5rem',
      color: '#e74c3c'
    }}>
      Error: {error}
    </div>
  );

  // Your actual data structure
  const categories = [
    { id: "bg-reg", name: "Business Risks", shortName: "BR" },
    { id: "hs-reg", name: "Health & Safety Risks", shortName: "HSR" },
    { id: "leg-reg", name: "Legislations", shortName: "LEG" },
    { id: "env-reg", name: "Environmental Aspects & Impacts", shortName: "ENV" },
    { id: "eq-reg", name: "Equipment & Inventory", shortName: "EQ" },
    { id: "tr-reg", name: "Trainings", shortName: "TR" },
    { id: "doc-reg", name: "Documents", shortName: "DOC" },
    { id: "ven-reg", name: "Vendors", shortName: "VEN" },
    { id: "cus-reg", name: "Customers", shortName: "CUS" },
    { id: "fb-reg", name: "Feedbacks", shortName: "FB" },
    { id: "ear-reg", name: "Employee Appraisals", shortName: "EAR" },
    { id: "moc-reg", name: "Management Of Changes", shortName: "MOC" },
    { id: "fl-reg", name: "Findings", shortName: "FL" },
    { id: "ao-reg", name: "Assurances & Oversights", shortName: "AO" },
    { id: "mr-reg", name: "Management Review", shortName: "MR" }
  ];

  // Map your API data here - replace with actual API response mapping
  const chartData = categories.map(cat => ({
    name: cat.shortName,
    fullName: cat.name,
    totalActions: Math.floor(Math.random() * 60) + 20,
    closedActions: Math.floor(Math.random() * 40) + 10,
    closureRate: Math.floor(Math.random() * 40) + 60
  }));

  // Overdue Actions Trend Data - replace with actual API data
  const overdueData = [
    { month: 'January', overdue: Math.floor(Math.random() * 15) + 5 },
    { month: 'February', overdue: Math.floor(Math.random() * 15) + 5 },
    { month: 'March', overdue: Math.floor(Math.random() * 15) + 5 },
    { month: 'April', overdue: Math.floor(Math.random() * 15) + 5 },
    { month: 'May', overdue: Math.floor(Math.random() * 15) + 5 },
    { month: 'June', overdue: Math.floor(Math.random() * 15) + 5 },
    { month: 'July', overdue: Math.floor(Math.random() * 15) + 5 },
    { month: 'August', overdue: Math.floor(Math.random() * 15) + 5 },
    { month: 'September', overdue: Math.floor(Math.random() * 15) + 5 },
    { month: 'October', overdue: Math.floor(Math.random() * 15) + 5 },
    { month: 'November', overdue: Math.floor(Math.random() * 15) + 5 },
    { month: 'December', overdue: Math.floor(Math.random() * 15) + 5 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = chartData.find(item => item.name === label);
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          padding: '15px 20px',
          border: '2px solid #ddd',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          minWidth: '250px'
        }}>
          <p style={{ 
            fontWeight: 'bold', 
            marginBottom: '12px',
            fontSize: '1.1rem',
            color: '#333',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '8px'
          }}>{data?.fullName || label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              margin: '6px 0',
              color: entry.color,
              fontWeight: '600',
              fontSize: '0.95rem',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '15px'
            }}>
              <span>{entry.name}:</span>
              <span>{entry.name.includes('%') ? `${entry.value}%` : entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const OverdueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          padding: '15px 20px',
          border: '2px solid #e74c3c',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          minWidth: '200px'
        }}>
          <p style={{ 
            fontWeight: 'bold', 
            marginBottom: '10px',
            fontSize: '1.1rem',
            color: '#333',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '8px'
          }}>{label}</p>
          <p style={{ 
            margin: '0',
            color: '#e74c3c',
            fontWeight: '600',
            fontSize: '1.1rem',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '15px'
          }}>
            <span>Overdue Actions:</span>
            <span>{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ 
      padding: '30px 40px',
      paddingBottom: '60px', // Alt kısım için ekstra boşluk
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      height: 'auto', // Auto height
      marginLeft: '250px',
      width: 'calc(100vw - 250px)',
      overflowY: 'auto', // Scroll aktif
      overflowX: 'hidden' // Yatay scroll kapalı
    }}>
      <div style={{
        marginBottom: '30px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '25px 30px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.25)'
      }}>
        <h1 style={{ 
          color: 'white',
          margin: 0,
          fontSize: '2.2rem',
          fontWeight: '700',
          letterSpacing: '0.5px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>KPI Dashboard</h1>
        <p style={{
          color: 'rgba(255,255,255,0.9)',
          margin: '8px 0 0 0',
          fontSize: '1rem'
        }}>Comprehensive Analytics Overview</p>
      </div>
      
      {/* First Chart - Action Metrics Breakdown */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        padding: '30px',
        border: '1px solid #e8e8e8',
        marginBottom: '30px'
      }}>
        <div style={{
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '2px solid #f0f0f0'
        }}>
          <h2 style={{
            margin: 0,
            color: '#2c3e50',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>Action Metrics Breakdown</h2>
        </div>
        
        <ResponsiveContainer width="100%" height={550}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 100, left: 60, bottom: 60 }}
            barGap={2}
          >
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2196F3" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#1976D2" stopOpacity={1}/>
              </linearGradient>
              <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF9800" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#F57C00" stopOpacity={1}/>
              </linearGradient>
              <linearGradient id="greyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9E9E9E" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#757575" stopOpacity={1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e0e0e0" 
              vertical={false}
            />
            
            <XAxis 
              dataKey="name" 
              stroke="#666"
              style={{ fontSize: '0.85rem', fontWeight: '600' }}
              tick={{ fill: '#555' }}
              axisLine={{ stroke: '#ccc', strokeWidth: 2 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            
            <YAxis 
              yAxisId="left"
              orientation="left"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              stroke="#666"
              style={{ fontSize: '0.9rem', fontWeight: '600' }}
              tick={{ fill: '#555' }}
              axisLine={{ stroke: '#ccc', strokeWidth: 2 }}
              label={{ 
                value: 'Number of Actions', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: '0.95rem', fontWeight: '600', fill: '#555' }
              }}
            />
            
            <YAxis 
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              tickFormatter={(value) => `${value}%`}
              stroke="#666"
              style={{ fontSize: '0.9rem', fontWeight: '600' }}
              tick={{ fill: '#555' }}
              axisLine={{ stroke: '#ccc', strokeWidth: 2 }}
              label={{ 
                value: 'Closure Rate (%)', 
                angle: 90, 
                position: 'insideRight',
                style: { fontSize: '0.95rem', fontWeight: '600', fill: '#555' }
              }}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }} />
            
            <Legend 
              wrapperStyle={{ 
                paddingTop: '25px',
                fontSize: '0.95rem',
                fontWeight: '600'
              }}
              iconType="rect"
              iconSize={14}
            />
            
            <Bar 
              yAxisId="left"
              dataKey="totalActions" 
              fill="url(#blueGradient)"
              name="Total # of Actions"
              radius={[6, 6, 0, 0]}
              maxBarSize={35}
            />
            
            <Bar 
              yAxisId="left"
              dataKey="closedActions" 
              fill="url(#orangeGradient)"
              name="Number of Closed Actions"
              radius={[6, 6, 0, 0]}
              maxBarSize={35}
            />
            
            <Bar 
              yAxisId="right"
              dataKey="closureRate" 
              fill="url(#greyGradient)"
              name="Closure Rate (%)"
              radius={[6, 6, 0, 0]}
              maxBarSize={35}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Second Chart - Overdue Actions Trend Analysis */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        padding: '30px',
        border: '1px solid #e8e8e8'
      }}>
        <div style={{
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '2px solid #f0f0f0'
        }}>
          <h2 style={{
            margin: 0,
            color: '#2c3e50',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>Overdue Actions Trend Analysis</h2>
        </div>
        
        <ResponsiveContainer width="100%" height={450}>
          <LineChart
            data={overdueData}
            margin={{ top: 20, right: 60, left: 60, bottom: 20 }}
          >
            <defs>
              <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e74c3c" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#c0392b" stopOpacity={1}/>
              </linearGradient>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e74c3c" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#e74c3c" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e0e0e0" 
              vertical={false}
            />
            
            <XAxis 
              dataKey="month" 
              stroke="#666"
              style={{ fontSize: '0.9rem', fontWeight: '600' }}
              tick={{ fill: '#555' }}
              axisLine={{ stroke: '#ccc', strokeWidth: 2 }}
            />
            
            <YAxis 
              stroke="#666"
              style={{ fontSize: '0.9rem', fontWeight: '600' }}
              tick={{ fill: '#555' }}
              axisLine={{ stroke: '#ccc', strokeWidth: 2 }}
              domain={[0, 'auto']}
              label={{ 
                value: 'Number of Overdue Actions', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: '0.95rem', fontWeight: '600', fill: '#555' }
              }}
            />
            
            <Tooltip content={<OverdueTooltip />} cursor={{ stroke: '#e74c3c', strokeWidth: 2, strokeDasharray: '5 5' }} />
            
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                fontSize: '0.95rem',
                fontWeight: '600'
              }}
              iconType="line"
            />
            
            <Line 
              type="monotone"
              dataKey="overdue" 
              stroke="url(#redGradient)"
              strokeWidth={3}
              dot={{ 
                fill: '#e74c3c', 
                stroke: '#fff', 
                strokeWidth: 2, 
                r: 5 
              }}
              activeDot={{ 
                r: 8, 
                stroke: '#fff', 
                strokeWidth: 2,
                fill: '#e74c3c'
              }}
              name="Overdue Actions"
              fill="url(#areaGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default KPIDashboard;