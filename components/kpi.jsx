import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'http://localhost:8000';

const KPIDashboard = () => {
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState("datas");

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
      width: 'calc(100vw - 250px)',
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
      width: 'calc(100vw - 250px)',
      fontSize: '1.5rem',
      color: '#e74c3c'
    }}>
      Error: {error}
    </div>
  );

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

  const chartData = categories.map(cat => ({
    name: cat.shortName,
    fullName: cat.name,
    totalActions: Math.floor(Math.random() * 60) + 20,
    closedActions: Math.floor(Math.random() * 40) + 10,
    closureRate: Math.floor(Math.random() * 40) + 60
  }));

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

  const incidentData = [
    { month: 'January', jobs: Math.floor(Math.random() * 40) + 20, incidents: Math.floor(Math.random() * 10) + 2, rate: (Math.random() * 5 + 1).toFixed(2) },
    { month: 'February', jobs: Math.floor(Math.random() * 40) + 20, incidents: Math.floor(Math.random() * 10) + 2, rate: (Math.random() * 5 + 1).toFixed(2) },
    { month: 'March', jobs: Math.floor(Math.random() * 40) + 20, incidents: Math.floor(Math.random() * 10) + 2, rate: (Math.random() * 5 + 1).toFixed(2) },
    { month: 'April', jobs: Math.floor(Math.random() * 40) + 20, incidents: Math.floor(Math.random() * 10) + 2, rate: (Math.random() * 5 + 1).toFixed(2) },
    { month: 'May', jobs: Math.floor(Math.random() * 40) + 20, incidents: Math.floor(Math.random() * 10) + 2, rate: (Math.random() * 5 + 1).toFixed(2) },
    { month: 'June', jobs: Math.floor(Math.random() * 40) + 20, incidents: Math.floor(Math.random() * 10) + 2, rate: (Math.random() * 5 + 1).toFixed(2) },
    { month: 'July', jobs: Math.floor(Math.random() * 40) + 20, incidents: Math.floor(Math.random() * 10) + 2, rate: (Math.random() * 5 + 1).toFixed(2) },
    { month: 'August', jobs: Math.floor(Math.random() * 40) + 20, incidents: Math.floor(Math.random() * 10) + 2, rate: (Math.random() * 5 + 1).toFixed(2) },
    { month: 'September', jobs: Math.floor(Math.random() * 40) + 20, incidents: Math.floor(Math.random() * 10) + 2, rate: (Math.random() * 5 + 1).toFixed(2) },
    { month: 'October', jobs: Math.floor(Math.random() * 40) + 20, incidents: Math.floor(Math.random() * 10) + 2, rate: (Math.random() * 5 + 1).toFixed(2) },
    { month: 'November', jobs: Math.floor(Math.random() * 40) + 20, incidents: Math.floor(Math.random() * 10) + 2, rate: (Math.random() * 5 + 1).toFixed(2) },
    { month: 'December', jobs: Math.floor(Math.random() * 40) + 20, incidents: Math.floor(Math.random() * 10) + 2, rate: (Math.random() * 5 + 1).toFixed(2) }
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

  const IncidentTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          padding: '15px 20px',
          border: '2px solid #2196F3',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          minWidth: '220px'
        }}>
          <p style={{ 
            fontWeight: 'bold', 
            marginBottom: '12px',
            fontSize: '1.1rem',
            color: '#333',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '8px'
          }}>{label}</p>
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
              <span>{entry.name.includes('Rate') ? `${entry.value}%` : entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      position: 'fixed',
      top: '80px', // pt-20 = 80px (navbar için)
      left: '256px', // ml-64 = 256px (sidebar için)
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      background: 'linear-gradient(to bottom right, rgba(239, 246, 255, 0.5), white)'
    }}>
      {selectedOption === "e-chart" ? (
        // E-CHART VIEW
        <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          margin: '20px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #e3f2fd',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              background: 'linear-gradient(to right, #2196F3, #1565C0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              Analytics Dashboard
            </h3>
            <button
              onClick={() => setSelectedOption("datas")}
              style={{
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: '#2196F3',
                padding: '8px 16px',
                border: '1px solid #e0e0e0',
                fontSize: '0.875rem',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.color = '#1976D2';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#2196F3';
              }}
            >
              <i className="fas fa-table" style={{ marginRight: '8px' }}></i>
              Data View
            </button>
          </div>
          
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Action Metrics Breakdown */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                padding: '20px'
              }}>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: '#424242'
                }}>
                  Action Metrics Breakdown
                </h4>
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
                    
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                    
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
                    <Legend wrapperStyle={{ paddingTop: '25px', fontSize: '0.95rem', fontWeight: '600' }} iconType="rect" iconSize={14} />
                    
                    <Bar yAxisId="left" dataKey="totalActions" fill="url(#blueGradient)" name="Total # of Actions" radius={[6, 6, 0, 0]} maxBarSize={35} />
                    <Bar yAxisId="left" dataKey="closedActions" fill="url(#orangeGradient)" name="Number of Closed Actions" radius={[6, 6, 0, 0]} maxBarSize={35} />
                    <Bar yAxisId="right" dataKey="closureRate" fill="url(#greyGradient)" name="Closure Rate (%)" radius={[6, 6, 0, 0]} maxBarSize={35} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Overdue Actions Trend */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                padding: '20px'
              }}>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: '#424242'
                }}>
                  Overdue Actions Trend Analysis
                </h4>
                <ResponsiveContainer width="100%" height={450}>
                  <LineChart data={overdueData} margin={{ top: 20, right: 60, left: 60, bottom: 20 }}>
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
                    
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                    <XAxis dataKey="month" stroke="#666" style={{ fontSize: '0.9rem', fontWeight: '600' }} tick={{ fill: '#555' }} axisLine={{ stroke: '#ccc', strokeWidth: 2 }} />
                    <YAxis stroke="#666" style={{ fontSize: '0.9rem', fontWeight: '600' }} tick={{ fill: '#555' }} axisLine={{ stroke: '#ccc', strokeWidth: 2 }} domain={[0, 'auto']} label={{ value: 'Number of Overdue Actions', angle: -90, position: 'insideLeft', style: { fontSize: '0.95rem', fontWeight: '600', fill: '#555' } }} />
                    <Tooltip content={<OverdueTooltip />} cursor={{ stroke: '#e74c3c', strokeWidth: 2, strokeDasharray: '5 5' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '0.95rem', fontWeight: '600' }} iconType="line" />
                    <Line type="monotone" dataKey="overdue" stroke="url(#redGradient)" strokeWidth={3} dot={{ fill: '#e74c3c', stroke: '#fff', strokeWidth: 2, r: 5 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2, fill: '#e74c3c' }} name="Overdue Actions" fill="url(#areaGradient)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Incident Rate */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                padding: '20px'
              }}>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: '#424242'
                }}>
                  Incident Rate Chart
                </h4>
                <ResponsiveContainer width="100%" height={500}>
                  <ComposedChart data={incidentData} margin={{ top: 20, right: 100, left: 60, bottom: 20 }}>
                    <defs>
                      <linearGradient id="blueBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2196F3" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#1976D2" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="orangeBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF9800" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#F57C00" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="greenLineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#388E3C" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                    <XAxis dataKey="month" stroke="#666" style={{ fontSize: '0.9rem', fontWeight: '600' }} tick={{ fill: '#555' }} axisLine={{ stroke: '#ccc', strokeWidth: 2 }} />
                    <YAxis yAxisId="left" orientation="left" domain={[0, 'auto']} stroke="#666" style={{ fontSize: '0.9rem', fontWeight: '600' }} tick={{ fill: '#555' }} axisLine={{ stroke: '#ccc', strokeWidth: 2 }} label={{ value: 'Number of Jobs/Incidents', angle: -90, position: 'insideLeft', style: { fontSize: '0.95rem', fontWeight: '600', fill: '#555' } }} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 10]} ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} tickFormatter={(value) => `${value}%`} stroke="#666" style={{ fontSize: '0.9rem', fontWeight: '600' }} tick={{ fill: '#555' }} axisLine={{ stroke: '#ccc', strokeWidth: 2 }} label={{ value: 'Rate of Incident (%)', angle: 90, position: 'insideRight', style: { fontSize: '0.95rem', fontWeight: '600', fill: '#555' } }} />
                    <Tooltip content={<IncidentTooltip />} cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '0.95rem', fontWeight: '600' }} iconSize={14} />
                    <Bar yAxisId="left" dataKey="jobs" fill="url(#blueBarGradient)" name="Number of Jobs" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    <Bar yAxisId="left" dataKey="incidents" fill="url(#orangeBarGradient)" name="Number of Incidents" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    <Line yAxisId="right" type="monotone" dataKey="rate" stroke="url(#greenLineGradient)" strokeWidth={3} dot={{ fill: '#4CAF50', stroke: '#fff', strokeWidth: 2, r: 6 }} activeDot={{ r: 9, stroke: '#fff', strokeWidth: 2, fill: '#4CAF50' }} name="Rate of Incident (%)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // DATA VIEW
        <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          margin: '20px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #e3f2fd',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                background: 'linear-gradient(to right, #2196F3, #1565C0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                KPI Data
              </h3>
              <button style={{
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: '#2196F3',
                padding: '8px 16px',
                border: '1px solid #e0e0e0',
                fontSize: '0.875rem',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                Add KPI
              </button>
              <button style={{
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: '#2196F3',
                padding: '8px 16px',
                border: '1px solid #e0e0e0',
                fontSize: '0.875rem',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <i className="fas fa-archive" style={{ marginRight: '8px' }}></i>
                Show Archived
              </button>
              <button style={{
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: '#2196F3',
                padding: '8px 16px',
                border: '1px solid #e0e0e0',
                fontSize: '0.875rem',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <i className="fas fa-trash" style={{ marginRight: '8px' }}></i>
                Show Deleted
              </button>
              <button style={{
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: '#2196F3',
                padding: '8px 16px',
                border: '1px solid #e0e0e0',
                fontSize: '0.875rem',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <i className="fas fa-tasks" style={{ marginRight: '8px' }}></i>
                Show Action
              </button>
            </div>

            <div style={{ marginLeft: 'auto' }}>
              <button
                onClick={() => setSelectedOption("e-chart")}
                style={{
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  color: '#2196F3',
                  padding: '8px 16px',
                  border: '1px solid #e0e0e0',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5';
                  e.target.style.color = '#1976D2';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#2196F3';
                }}
              >
                <i className="fas fa-chart-bar" style={{ marginRight: '8px' }}></i>
                E-Chart
              </button>
            </div>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '32px',
            textAlign: 'center'
          }}>
            <i className="fas fa-table" style={{ fontSize: '4rem', color: '#bbdefb', marginBottom: '16px' }}></i>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#424242',
              marginBottom: '8px'
            }}>
              Data Table View
            </h3>
            <p style={{ color: '#757575' }}>
              Your KPI data table will be displayed here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIDashboard;