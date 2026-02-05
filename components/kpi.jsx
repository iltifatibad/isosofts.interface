import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'http://localhost:8000';

const KPIDashboard = () => {
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState("datas"); // "datas" veya "e-chart"

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
    <div className="pt-20 h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Main Content Area */}
        <div className="flex-1 ml-64 p-8 bg-gradient-to-br from-blue-50/50 to-white h-full overflow-y-auto">
          {selectedOption === "e-chart" ? (
            // E-CHART VIEW
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-blue-100 flex justify-between items-center">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h3>
                <div className="flex space-x-3 items-center">
                  <button
                    onClick={() => setSelectedOption("datas")}
                    className="rounded-lg whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    <i className="fas fa-table mr-2 text-blue-600 hover:text-blue-700"></i>
                    Data View
                  </button>
                </div>
              </div>
              
              {/* Charts Container */}
              <div className="p-6 overflow-x-auto max-h-[75vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Action Metrics Breakdown */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h4 className="text-lg font-semibold mb-4 text-gray-700">
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
                  <div className="bg-white rounded-lg shadow p-4">
                    <h4 className="text-lg font-semibold mb-4 text-gray-700">
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
                  <div className="bg-white rounded-lg shadow p-4">
                    <h4 className="text-lg font-semibold mb-4 text-gray-700">
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
            // DATA VIEW (TABLE) - Burayı ileride ekleyebilirsin
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-blue-100 flex items-center">
                <div className="flex items-center space-x-3">
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    KPI Data
                  </h3>
                  <button
                    className="rounded-lg whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    <i className="fas fa-plus mr-2 text-blue-600 hover:text-blue-700"></i>
                    Add KPI
                  </button>
                  <button
                    className="rounded-lg whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    <i className="fas fa-archive mr-2 text-blue-600 hover:text-blue-700"></i>
                    Show Archived
                  </button>
                  <button
                    className="rounded-lg whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    <i className="fas fa-trash mr-2 text-blue-600 hover:text-blue-700"></i>
                    Show Deleted
                  </button>
                  <button
                    className="rounded-lg whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    <i className="fas fa-tasks mr-2 text-blue-600 hover:text-blue-700"></i>
                    Show Action
                  </button>
                </div>

                <div className="ml-auto">
                  <button
                    onClick={() => setSelectedOption("e-chart")}
                    className="rounded-lg whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    <i className="fas fa-chart-bar mr-2 text-blue-600 hover:text-blue-700"></i>
                    E-Chart
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[75vh] overflow-y-auto">
                <div className="p-8 text-center">
                  <i className="fas fa-table text-6xl text-blue-300 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Data Table View
                  </h3>
                  <p className="text-gray-500">
                    Your KPI data table will be displayed here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;