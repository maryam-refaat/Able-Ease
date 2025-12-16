import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, DollarSign, FileText, Activity, TrendingUp, Calendar, Building, Heart, PresentationIcon, ArrowUp, ArrowDown } from 'lucide-react';

// API Base URL - change this to your actual API URL
const API_BASE_URL = 'https://localhost:7040/api';

// Enhanced color palette - green and white theme
const COLORS = {
  primary: '#059669',
  primaryLight: '#10b981',
  primaryDark: '#047857',
  secondary: '#34d399',
  accent: '#6ee7b7',
  background: '#f0fdf4',
  cardBg: '#ffffff',
  textPrimary: '#064e3b',
  textSecondary: '#065f46',
  textMuted: '#6b7280',
  border: '#d1fae5',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  chartColors: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
};

// Utility function for API calls with better error handling
const fetchReport = async (endpoint) => {
  try {
    console.log(`Fetching: ${API_BASE_URL}/reports/${endpoint}`);
    const response = await fetch(`${API_BASE_URL}/reports/${endpoint}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP Error ${response.status}: ${errorText}`);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

// ============================================
// ENHANCED STAT CARD WITH ANIMATIONS
// ============================================

const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
  <div 
    className="stat-card group"
    style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
      border: `2px solid ${COLORS.border}`,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1), 0 2px 4px -1px rgba(5, 150, 105, 0.06)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: 'fadeInUp 0.6s ease-out forwards',
      opacity: 0,
    }}
  >
    <style>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 25px -5px rgba(5, 150, 105, 0.15), 0 10px 10px -5px rgba(5, 150, 105, 0.08);
        border-color: ${COLORS.primary};
      }
      
      .icon-container {
        transition: all 0.3s ease;
      }
      
      .stat-card:hover .icon-container {
        transform: scale(1.1) rotate(5deg);
      }
    `}</style>
    
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{ flex: 1 }}>
        <p style={{ 
          fontSize: '13px', 
          color: COLORS.textMuted, 
          marginBottom: '8px',
          fontWeight: '500',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          {title}
        </p>
        <p style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: COLORS.textPrimary,
          marginBottom: '4px',
          lineHeight: '1.2'
        }}>
          {value}
        </p>
        {subtitle && (
          <p style={{ 
            fontSize: '13px', 
            color: COLORS.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {trend && (
              trend > 0 ? 
                <ArrowUp size={14} color={COLORS.success} /> : 
                <ArrowDown size={14} color={COLORS.danger} />
            )}
            {subtitle}
          </p>
        )}
      </div>
      <div 
        className="icon-container"
        style={{ 
          background: `linear-gradient(135deg, ${color} 0%, ${COLORS.primaryLight} 100%)`,
          borderRadius: '12px',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon size={24} color="white" />
      </div>
    </div>
  </div>
);

// ============================================
// ENHANCED PATIENT STATISTICS CARD
// ============================================

const PatientStatisticsCard = ({ data }) => {
  if (!data) return <div className="skeleton-card" style={{ height: '420px' }}></div>;
  
  const genderData = [
    { name: 'Male', value: data.maleCount, percentage: data.malePercentage },
    { name: 'Female', value: data.femaleCount, percentage: data.femalePercentage }
  ];
  
  const GENDER_COLORS = [COLORS.primary, COLORS.secondary];

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)',
      border: `1px solid ${COLORS.border}`,
      animation: 'fadeInUp 0.6s ease-out 0.2s forwards',
      opacity: 0
    }}>
      <style>{`
        .skeleton-card {
          background: linear-gradient(90deg, #f0fdf4 25%, #d1fae5 50%, #f0fdf4 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 16px;
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: '700', 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: COLORS.textPrimary
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          borderRadius: '8px',
          padding: '8px',
          display: 'flex'
        }}>
          <Users size={20} color="white" />
        </div>
        Patient Statistics
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '4px' }}>Total Patients</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: COLORS.primary }}>{data.totalPatients}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '4px' }}>Average Age</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: COLORS.primary }}>{data.averageAge} <span style={{ fontSize: '16px', fontWeight: '500' }}>yrs</span></p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`,
          gridColumn: 'span 2'
        }}>
          <p style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '4px' }}>In Programs</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: COLORS.primary }}>{data.patientsInPrograms}</p>
        </div>
      </div>
      
      <div style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={genderData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {genderData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={GENDER_COLORS[index]} 
                  strokeWidth={2}
                  stroke="white"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                background: 'white',
                border: `2px solid ${COLORS.border}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ============================================
// ENHANCED FINANCIAL OVERVIEW CARD
// ============================================

const FinancialOverviewCard = ({ data }) => {
  if (!data) return <div className="skeleton-card" style={{ height: '420px' }}></div>;
  
  const statusData = [
    { name: 'Approved', value: data.approvedCount, percentage: data.approvalRate },
    { name: 'Pending', value: data.pendingCount, percentage: data.pendingRate },
    { name: 'Rejected', value: data.rejectedCount, percentage: data.rejectionRate }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)',
      border: `1px solid ${COLORS.border}`,
      animation: 'fadeInUp 0.6s ease-out 0.3s forwards',
      opacity: 0
    }}>
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: '700', 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: COLORS.textPrimary
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          borderRadius: '8px',
          padding: '8px',
          display: 'flex'
        }}>
          <DollarSign size={20} color="white" />
        </div>
        Financial Overview
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '4px' }}>Total Applications</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: COLORS.primary }}>{data.totalApplications}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '4px' }}>Average Aid</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>{data.averageAidPerApplication}%</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          padding: '16px',
          borderRadius: '12px',
          gridColumn: 'span 2'
        }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', marginBottom: '4px' }}>Approval Rate</p>
          <p style={{ fontSize: '32px', fontWeight: '700', color: 'white' }}>{data.approvalRate}%</p>
        </div>
      </div>
      
      <div style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: COLORS.textMuted, fontSize: 12 }}
              axisLine={{ stroke: COLORS.border }}
            />
            <YAxis 
              tick={{ fill: COLORS.textMuted, fontSize: 12 }}
              axisLine={{ stroke: COLORS.border }}
            />
            <Tooltip 
              contentStyle={{
                background: 'white',
                border: `2px solid ${COLORS.border}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)'
              }}
            />
            <Bar 
              dataKey="value" 
              fill={COLORS.primary}
              radius={[8, 8, 0, 0]}
              animationBegin={0}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ============================================
// ENHANCED CAREGIVER WORKLOAD CARD
// ============================================

const CaregiverWorkloadCard = ({ data }) => {
  if (!data) return <div className="skeleton-card" style={{ height: '420px' }}></div>;

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)',
      border: `1px solid ${COLORS.border}`,
      animation: 'fadeInUp 0.6s ease-out 0.4s forwards',
      opacity: 0
    }}>
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: '700', 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: COLORS.textPrimary
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          borderRadius: '8px',
          padding: '8px',
          display: 'flex'
        }}>
          <Heart size={20} color="white" />
        </div>
        Caregiver Workload
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Total Caregivers</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>{data.totalCaregivers}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Avg Patients Per Caregiver</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>{data.averagePatientsPerCaregiver}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.warning}15 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.warning}30`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Max Workload</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.warning }}>{data.maxPatientsPerCaregiver}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary}15 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Min Workload</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>{data.minPatientsPerCaregiver}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Total Reports</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>{data.totalReportsGenerated}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.danger}15 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.danger}30`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Without Patients</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.danger }}>{data.caregiversWithZeroPatients}</p>
        </div>
      </div>
      
      {data.mostLoadedCaregiverName && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: `linear-gradient(135deg, ${COLORS.warning}10 0%, ${COLORS.warning}05 100%)`,
          borderRadius: '12px',
          border: `1px solid ${COLORS.warning}30`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Most Loaded Caregiver</p>
          <p style={{ fontSize: '16px', fontWeight: '600', color: COLORS.textPrimary }}>{data.mostLoadedCaregiverName}</p>
        </div>
      )}
    </div>
  );
};

// ============================================
// ENHANCED PAYMENT STATISTICS CARD
// ============================================

const PaymentStatisticsCard = ({ data }) => {
  if (!data) return <div className="skeleton-card" style={{ height: '420px' }}></div>;

  const timeSeriesData = [
    { period: 'This Month', payments: data.paymentsThisMonth, amount: data.totalAmountThisMonth },
    { period: 'This Year', payments: data.paymentsThisYear, amount: data.totalAmountThisYear },
    { period: 'All Time', payments: data.totalPaymentsAllTime, amount: data.totalAmountAllTime }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)',
      border: `1px solid ${COLORS.border}`,
      animation: 'fadeInUp 0.6s ease-out 0.5s forwards',
      opacity: 0
    }}>
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: '700', 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: COLORS.textPrimary
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          borderRadius: '8px',
          padding: '8px',
          display: 'flex'
        }}>
          <TrendingUp size={20} color="white" />
        </div>
        Payment Statistics
      </h3>
      
      <div style={{ height: '140px', marginBottom: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis 
              dataKey="period" 
              tick={{ fill: COLORS.textMuted, fontSize: 11 }}
              axisLine={{ stroke: COLORS.border }}
            />
            <YAxis 
              tick={{ fill: COLORS.textMuted, fontSize: 11 }}
              axisLine={{ stroke: COLORS.border }}
            />
            <Tooltip 
              contentStyle={{
                background: 'white',
                border: `2px solid ${COLORS.border}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="payments" 
              stroke={COLORS.primary} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPayments)"
              animationBegin={0}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Average Payment</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: COLORS.primary }}>${data.averagePaymentAmount}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.success}20 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.success}40`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Approval Rate</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: COLORS.success }}>{data.approvalRate}%</p>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        padding: '12px',
        background: COLORS.background,
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: '500'
      }}>
        <span style={{ color: COLORS.success }}>✓ Approved: {data.approvedPayments}</span>
        <span style={{ color: COLORS.warning }}>⏳ Pending: {data.pendingPayments}</span>
        <span style={{ color: COLORS.danger }}>✗ Rejected: {data.rejectedPayments}</span>
      </div>
    </div>
  );
};

// ============================================
// PROGRAM ENROLLMENT CARD
// ============================================

const ProgramEnrollmentCard = ({ data }) => {
  if (!data) return <div className="skeleton-card" style={{ height: '420px' }}></div>;

  const statusData = [
    { name: 'Active', value: data.activePrograms, color: COLORS.success },
    { name: 'Inactive', value: data.inactivePrograms, color: COLORS.textMuted }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)',
      border: `1px solid ${COLORS.border}`,
      animation: 'fadeInUp 0.6s ease-out 0.6s forwards',
      opacity: 0
    }}>
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: '700', 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: COLORS.textPrimary
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          borderRadius: '8px',
          padding: '8px',
          display: 'flex'
        }}>
          <Activity size={20} color="white" />
        </div>
        Program Enrollment
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Total Programs</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: COLORS.primary }}>{data.totalPrograms}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Total Enrolled</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: COLORS.primary }}>{data.totalEnrolledPatients}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.success}15 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.success}30`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Active Programs</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: COLORS.success }}>{data.activePrograms}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.textMuted}10 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.textMuted}20`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Avg Per Program</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: COLORS.primary }}>{data.averagePatientsPerProgram}</p>
        </div>
      </div>

      <div style={{ height: '120px', marginBottom: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={statusData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis type="number" tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: COLORS.textMuted, fontSize: 11 }}
            />
            <Tooltip 
              contentStyle={{
                background: 'white',
                border: `2px solid ${COLORS.border}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)'
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 8, 8, 0]}
              animationBegin={0}
              animationDuration={800}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {data.mostPopularProgramName && (
        <div style={{
          padding: '12px',
          background: `linear-gradient(135deg, ${COLORS.success}10 0%, white 100%)`,
          borderRadius: '12px',
          marginBottom: '8px',
          border: `1px solid ${COLORS.success}30`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '11px', color: COLORS.textMuted, marginBottom: '2px' }}>Most Popular Program</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPrimary }}>{data.mostPopularProgramName}</p>
            </div>
            <div style={{
              background: COLORS.success,
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {data.mostPopularProgramPatientCount} patients
            </div>
          </div>
        </div>
      )}

      {data.leastPopularProgramName && (
        <div style={{
          padding: '12px',
          background: `linear-gradient(135deg, ${COLORS.warning}10 0%, white 100%)`,
          borderRadius: '12px',
          marginBottom: '8px',
          border: `1px solid ${COLORS.warning}30`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '11px', color: COLORS.textMuted, marginBottom: '2px' }}>Least Popular Program</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPrimary }}>{data.leastPopularProgramName}</p>
            </div>
            <div style={{
              background: COLORS.warning,
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {data.leastPopularProgramPatientCount} patients
            </div>
          </div>
        </div>
      )}

      {data.programsWithNoPatients > 0 && (
        <div style={{
          padding: '12px',
          background: `linear-gradient(135deg, ${COLORS.danger}10 0%, white 100%)`,
          borderRadius: '12px',
          border: `1px solid ${COLORS.danger}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <p style={{ fontSize: '13px', color: COLORS.textSecondary, fontWeight: '500' }}>Programs with No Patients</p>
          <span style={{
            background: COLORS.danger,
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {data.programsWithNoPatients}
          </span>
        </div>
      )}
    </div>
  );
};

// ============================================
// REPORT GENERATION CARD
// ============================================

const ReportGenerationCard = ({ data }) => {
  if (!data) return <div className="skeleton-card" style={{ height: '420px' }}></div>;

  const timeData = [
    { period: 'This Month', value: data.reportsThisMonth },
    { period: 'This Quarter', value: data.reportsThisQuarter },
    { period: 'This Year', value: data.reportsThisYear }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)',
      border: `1px solid ${COLORS.border}`,
      animation: 'fadeInUp 0.6s ease-out 0.7s forwards',
      opacity: 0
    }}>
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: '700', 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: COLORS.textPrimary
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          borderRadius: '8px',
          padding: '8px',
          display: 'flex'
        }}>
          <FileText size={20} color="white" />
        </div>
        Report Generation
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          padding: '16px',
          borderRadius: '12px',
          gridColumn: 'span 2'
        }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', marginBottom: '4px' }}>Total Reports</p>
          <p style={{ fontSize: '32px', fontWeight: '700', color: 'white' }}>{data.totalReports}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Avg/Caregiver</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>{data.averageReportsPerCaregiver}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Avg/Patient</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>{data.averageReportsPerPatient}</p>
        </div>
      </div>

      <div style={{ height: '140px', marginBottom: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis 
              dataKey="period" 
              tick={{ fill: COLORS.textMuted, fontSize: 11 }}
              axisLine={{ stroke: COLORS.border }}
            />
            <YAxis 
              tick={{ fill: COLORS.textMuted, fontSize: 11 }}
              axisLine={{ stroke: COLORS.border }}
            />
            <Tooltip 
              contentStyle={{
                background: 'white',
                border: `2px solid ${COLORS.border}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={COLORS.primary} 
              strokeWidth={3}
              dot={{ fill: COLORS.primary, r: 5 }}
              activeDot={{ r: 7 }}
              animationBegin={0}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {data.mostActiveCaregiverName && (
        <div style={{
          padding: '12px',
          background: `linear-gradient(135deg, ${COLORS.success}10 0%, white 100%)`,
          borderRadius: '12px',
          marginBottom: '8px',
          border: `1px solid ${COLORS.success}30`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '11px', color: COLORS.textMuted, marginBottom: '2px' }}>Most Active Caregiver</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPrimary }}>{data.mostActiveCaregiverName}</p>
            </div>
            <div style={{
              background: COLORS.success,
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {data.mostActiveCaregiverReportCount} reports
            </div>
          </div>
        </div>
      )}

      {data.caregiversWithNoReports > 0 && (
        <div style={{
          padding: '12px',
          background: `linear-gradient(135deg, ${COLORS.danger}10 0%, white 100%)`,
          borderRadius: '12px',
          border: `1px solid ${COLORS.danger}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <p style={{ fontSize: '13px', color: COLORS.textSecondary, fontWeight: '500' }}>Caregivers with No Reports</p>
          <span style={{
            background: COLORS.danger,
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {data.caregiversWithNoReports}
          </span>
        </div>
      )}
    </div>
  );
};

// ============================================
// ORGANIZATION ACTIVITY CARD
// ============================================

const OrganizationActivityCard = ({ data }) => {
  if (!data) return <div className="skeleton-card" style={{ height: '420px' }}></div>;

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)',
      border: `1px solid ${COLORS.border}`,
      animation: 'fadeInUp 0.6s ease-out 0.8s forwards',
      opacity: 0
    }}>
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: '700', 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: COLORS.textPrimary
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          borderRadius: '8px',
          padding: '8px',
          display: 'flex'
        }}>
          <Building size={20} color="white" />
        </div>
        Organization Activity
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Total Organizations</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: COLORS.primary }}>{data.totalOrganizations}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Total Programs</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: COLORS.primary }}>{data.totalProgramsOffered}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Avg Programs/Org</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>{data.averageProgramsPerOrganization}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Total Caregivers</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>{data.totalCaregiversEmployed}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Avg Caregivers/Org</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>{data.averageCaregiversPerOrganization}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.success}15 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.success}30`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Financial Aids</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.success }}>{data.totalFinancialAidsProvided}</p>
        </div>
      </div>

      {data.largestOrganizationName && (
        <div style={{
          padding: '16px',
          background: `linear-gradient(135deg, ${COLORS.primary}10 0%, white 100%)`,
          borderRadius: '12px',
          marginBottom: '8px',
          border: `2px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '11px', color: COLORS.textMuted, marginBottom: '6px' }}>Largest Organization</p>
          <p style={{ fontSize: '16px', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '8px' }}>
            {data.largestOrganizationName}
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{
              background: COLORS.primary,
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {data.largestOrganizationProgramCount} programs
            </span>
            <span style={{
              background: COLORS.secondary,
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {data.largestOrganizationCaregiverCount} caregivers
            </span>
          </div>
        </div>
      )}

      {data.organizationsWithNoPrograms > 0 && (
        <div style={{
          padding: '12px',
          background: `linear-gradient(135deg, ${COLORS.warning}10 0%, white 100%)`,
          borderRadius: '12px',
          border: `1px solid ${COLORS.warning}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <p style={{ fontSize: '13px', color: COLORS.textSecondary, fontWeight: '500' }}>Organizations with No Programs</p>
          <span style={{
            background: COLORS.warning,
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {data.organizationsWithNoPrograms}
          </span>
        </div>
      )}
    </div>
  );
};

// ============================================
// MEDICAL RECORDS CARD
// ============================================

const MedicalRecordsCard = ({ data }) => {
  if (!data) return <div className="skeleton-card" style={{ height: '420px' }}></div>;

  const timeData = [
    { period: 'This Month', value: data.recordsAddedThisMonth },
    { period: 'This Year', value: data.recordsAddedThisYear },
    { period: 'All Time', value: data.totalMedicalRecords }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)',
      border: `1px solid ${COLORS.border}`,
      animation: 'fadeInUp 0.6s ease-out 0.9s forwards',
      opacity: 0
    }}>
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: '700', 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: COLORS.textPrimary
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          borderRadius: '8px',
          padding: '8px',
          display: 'flex'
        }}>
          <FileText size={20} color="white" />
        </div>
        Medical Records
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          padding: '16px',
          borderRadius: '12px',
          gridColumn: 'span 2'
        }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', marginBottom: '4px' }}>Total Medical Records</p>
          <p style={{ fontSize: '32px', fontWeight: '700', color: 'white' }}>{data.totalMedicalRecords}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Avg/Patient</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>{data.averageRecordsPerPatient}</p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>Max/Patient</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: COLORS.primary }}>{data.maxRecordsPerPatient}</p>
        </div>
      </div>

      <div style={{ height: '140px', marginBottom: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeData}>
            <defs>
              <linearGradient id="colorRecords" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis 
              dataKey="period" 
              tick={{ fill: COLORS.textMuted, fontSize: 11 }}
              axisLine={{ stroke: COLORS.border }}
            />
            <YAxis 
              tick={{ fill: COLORS.textMuted, fontSize: 11 }}
              axisLine={{ stroke: COLORS.border }}
            />
            <Tooltip 
              contentStyle={{
                background: 'white',
                border: `2px solid ${COLORS.border}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={COLORS.primary} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRecords)"
              animationBegin={0}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        padding: '12px',
        background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)`,
        borderRadius: '12px',
        border: `1px solid ${COLORS.border}`,
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <p style={{ fontSize: '13px', color: COLORS.textSecondary, fontWeight: '500' }}>Records by Relatives</p>
        <span style={{
          background: COLORS.primary,
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          {data.recordsAddedByRelatives}
        </span>
      </div>

      {data.mostActiveRelativeName && (
        <div style={{
          padding: '12px',
          background: `linear-gradient(135deg, ${COLORS.success}10 0%, white 100%)`,
          borderRadius: '12px',
          border: `1px solid ${COLORS.success}30`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '11px', color: COLORS.textMuted, marginBottom: '2px' }}>Most Active Relative</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPrimary }}>{data.mostActiveRelativeName}</p>
            </div>
            <div style={{
              background: COLORS.success,
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {data.mostActiveRelativeRecordCount} records
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// ENHANCED DETAILED REPORT TABLES
// ============================================

const CaregiverPerformanceTable = ({ data }) => {
  // Flexible rows extraction
  const rows = Array.isArray(data) ? data : (data?.rows ?? data?.Rows ?? data?.data ?? []);
  const summary = data?.summary ?? data?.Summary ?? {};

  if (!data) {
    return <div className="skeleton-card" style={{ height: '500px' }}></div>;
  }

  if (rows.length === 0) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px 32px',
        textAlign: 'center',
        border: `2px dashed ${COLORS.border}`,
        boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)'
      }}>
        <Heart size={48} color={COLORS.textMuted} style={{ marginBottom: '16px', opacity: 0.5 }} />
        <p style={{ fontSize: '18px', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '8px' }}>
          {data._failed ? 'Failed to load Caregiver Performance data' : 'No Caregiver Performance Data'}
        </p>
        <p style={{ fontSize: '14px', color: COLORS.textMuted }}>
          {data._failed ? 'An error occurred while fetching this report. Check console for details.' : 'There are currently no caregiver performance records to display.'}
        </p>
        {data && (
          <details style={{ marginTop: '12px', fontSize: '12px', fontFamily: 'monospace' }}>
            <summary style={{ cursor: 'pointer' }}>Show raw response</summary>
            <pre style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', overflow: 'auto', maxHeight: '200px', marginTop: '8px' }}>{JSON.stringify(data, null, 2)}</pre>
          </details>
        )}
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)',
      border: `1px solid ${COLORS.border}`,
      animation: 'fadeInUp 0.6s ease-out forwards',
      opacity: 0
    }}>
      <h3 style={{ 
        fontSize: '22px', 
        fontWeight: '700', 
        marginBottom: '24px',
        color: COLORS.textPrimary,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          borderRadius: '8px',
          padding: '8px',
          display: 'flex'
        }}>
          <Heart size={20} color="white" />
        </div>
        Caregiver Performance Report
        <span style={{ 
          fontSize: '14px', 
          color: COLORS.success,
          background: `${COLORS.success}20`,
          padding: '4px 12px',
          borderRadius: '20px',
          fontWeight: '600',
          marginLeft: 'auto'
        }}>
          {rows.length} records
        </span>
      </h3>
      
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)` }}>
              <th style={tableHeaderStyle}>Organization</th>
              <th style={tableHeaderStyle}>Caregiver Name</th>
              <th style={tableHeaderStyle}>Patients</th>
              <th style={tableHeaderStyle}>Reports</th>
              <th style={tableHeaderStyle}>Avg Reports/Month</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr 
                key={index} 
                style={{ 
                  borderBottom: `1px solid ${COLORS.border}`,
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = COLORS.background}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <td style={tableCellStyle}>
                  {row.organizationName || row.OrganizationName || 'No Organization'}
                </td>
                <td style={{...tableCellStyle, fontWeight: '600', color: COLORS.textPrimary}}>
                  {row.caregiverName || 'N/A'}
                </td>
                <td style={tableCellStyle}>
                  <span style={badgeStyle(COLORS.primary)}>
                    {row.patientCount ?? 0}
                  </span>
                </td>
                <td style={tableCellStyle}>
                  <span style={badgeStyle(COLORS.secondary)}>
                    {row.reportCount ?? 0}
                  </span>
                </td>
                <td style={tableCellStyle}>
                  {row.averageReportsPerMonth ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ 
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
              color: 'white',
              fontWeight: '600'
            }}>
              <td colSpan={2} style={{...tableFooterStyle}}>
                TOTAL ({summary?.totalOrganizations ?? 0} Organizations)
              </td>
              <td style={tableFooterStyle}>
                {summary?.totalPatients ?? 0}
              </td>
              <td style={tableFooterStyle}>
                {summary?.totalReports ?? 0}
              </td>
              <td style={tableFooterStyle}>
                {summary?.totalCaregivers ?? 0} Caregivers
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const FinancialAidByOrgTable = ({ data }) => {
  // flexible extraction
  const rows = Array.isArray(data) ? data : (data?.rows ?? data?.Rows ?? data?.data ?? []);
  const summary = data?.summary ?? data?.Summary ?? {};

  if (!data) {
    return <div className="skeleton-card" style={{ height: '500px' }}></div>;
  }

  if (rows.length === 0) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px 32px',
        textAlign: 'center',
        border: `2px dashed ${COLORS.border}`,
        boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)'
      }}>
        <DollarSign size={48} color={COLORS.textMuted} style={{ marginBottom: '16px', opacity: 0.5 }} />
        <p style={{ fontSize: '18px', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '8px' }}>
          {data._failed ? 'Failed to load Financial Aid data' : 'No Financial Aid Data'}
        </p>
        <p style={{ fontSize: '14px', color: COLORS.textMuted }}>
          {data._failed ? 'An error occurred while fetching this report. Check console for details.' : 'There are currently no financial aid records to display.'}
        </p>
        {data && (
          <details style={{ marginTop: '12px', fontSize: '12px', fontFamily: 'monospace' }}>
            <summary style={{ cursor: 'pointer' }}>Show raw response</summary>
            <pre style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', overflow: 'auto', maxHeight: '200px', marginTop: '8px' }}>{JSON.stringify(data, null, 2)}</pre>
          </details>
        )}
      </div>
    );
  }

  const getStatusColor = (status) => {
    const statusStr = String(status || '').toLowerCase();
    if (statusStr.includes('approved') || statusStr === '1') return COLORS.success;
    if (statusStr.includes('pending') || statusStr === '0') return COLORS.warning;
    if (statusStr.includes('rejected') || statusStr === '2') return COLORS.danger;
    return COLORS.textMuted;
  };

  const getStatusText = (status) => {
    const statusStr = String(status || '');
    if (statusStr === '0') return 'Pending';
    if (statusStr === '1') return 'Approved';
    if (statusStr === '2') return 'Rejected';
    return status;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)',
      border: `1px solid ${COLORS.border}`,
      animation: 'fadeInUp 0.6s ease-out 0.2s forwards',
      opacity: 0
    }}>
      <h3 style={{ 
        fontSize: '22px', 
        fontWeight: '700', 
        marginBottom: '24px',
        color: COLORS.textPrimary,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          borderRadius: '8px',
          padding: '8px',
          display: 'flex'
        }}>
          <DollarSign size={20} color="white" />
        </div>
        Financial Aid by Organization
        <span style={{ 
          fontSize: '14px', 
          color: COLORS.success,
          background: `${COLORS.success}20`,
          padding: '4px 12px',
          borderRadius: '20px',
          fontWeight: '600',
          marginLeft: 'auto'
        }}>
          {rows.length} records
        </span>
      </h3>
      
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)` }}>
              <th style={tableHeaderStyle}>Organization</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Applications</th>
              <th style={tableHeaderStyle}>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr 
                key={index}
                style={{ 
                  borderBottom: `1px solid ${COLORS.border}`,
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = COLORS.background}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <td style={{...tableCellStyle, fontWeight: '600', color: COLORS.textPrimary}}>
                  {row.organizationName || row.OrganizationName || 'No Organization'}
                </td>
                <td style={tableCellStyle}>
                  <span style={{
                    ...badgeStyle(getStatusColor(row.status ?? row.Status)),
                    color: 'white'
                  }}>
                    {getStatusText(row.status ?? row.Status)}
                  </span>
                </td>
                <td style={tableCellStyle}>
                  <span style={badgeStyle(COLORS.primary)}>
                    {row.applicationCount ?? row.ApplicationCount ?? 0}
                  </span>
                </td>
                <td style={tableCellStyle}>
                  {(row.percentage ?? row.Percentage ?? 0)}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ 
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
              color: 'white',
              fontWeight: '600'
            }}>
              <td colSpan={2} style={tableFooterStyle}>
                GRAND TOTAL ({summary?.totalOrganizations ?? summary?.TotalOrganizations ?? 0} Organizations)
              </td>
              <td style={tableFooterStyle}>
                {summary?.totalApplications ?? summary?.TotalApplications ?? 0}
              </td>
              <td style={{...tableFooterStyle, color: '#d1fae5'}}>
                Approval: {summary?.overallApprovalRate ?? summary?.OverallApprovalRate ?? 0}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const PatientProgramEnrollmentTable = ({ data }) => {
  if (!data || !data.rows) {
    return <div className="skeleton-card" style={{ height: '500px' }}></div>;
  }

  if (data.rows.length === 0) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px 32px',
        textAlign: 'center',
        border: `2px dashed ${COLORS.border}`,
        boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)'
      }}>
        <Activity size={48} color={COLORS.textMuted} style={{ marginBottom: '16px', opacity: 0.5 }} />
        <p style={{ fontSize: '18px', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '8px' }}>
          No Program Enrollment Data
        </p>
        <p style={{ fontSize: '14px', color: COLORS.textMuted }}>
          There are currently no program enrollment records to display.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)',
      border: `1px solid ${COLORS.border}`,
      animation: 'fadeInUp 0.6s ease-out 0.4s forwards',
      opacity: 0
    }}>
      <h3 style={{ 
        fontSize: '22px', 
        fontWeight: '700', 
        marginBottom: '24px',
        color: COLORS.textPrimary,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          borderRadius: '8px',
          padding: '8px',
          display: 'flex'
        }}>
          <Activity size={20} color="white" />
        </div>
        Patient Program Enrollment
        <span style={{ 
          fontSize: '14px', 
          color: COLORS.success,
          background: `${COLORS.success}20`,
          padding: '4px 12px',
          borderRadius: '20px',
          fontWeight: '600',
          marginLeft: 'auto'
        }}>
          {data.rows.length} records
        </span>
      </h3>
      
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: `linear-gradient(135deg, ${COLORS.background} 0%, white 100%)` }}>
              <th style={tableHeaderStyle}>Program Name</th>
              <th style={tableHeaderStyle}>Patient Name</th>
              <th style={tableHeaderStyle}>Enrollment Date</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Caregiver</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, index) => {
              const enrollDate = row.enrollmentDate;
              const status = row.status;
              
              return (
                <tr 
                  key={index}
                  style={{ 
                    borderBottom: `1px solid ${COLORS.border}`,
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = COLORS.background}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <td style={{...tableCellStyle, fontWeight: '600', color: COLORS.textPrimary}}>
                    {row.programName || 'N/A'}
                  </td>
                  <td style={tableCellStyle}>
                    {row.patientName || 'N/A'}
                  </td>
                  <td style={tableCellStyle}>
                    {enrollDate ? new Date(enrollDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: status === 'Started' || status === '1' ? `${COLORS.success}20` : `${COLORS.textMuted}20`,
                      color: status === 'Started' || status === '1' ? COLORS.success : COLORS.textMuted
                    }}>
                      {status === '1' ? 'Started' : (status || 'Unknown')}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    {row.caregiverName || 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ 
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
              color: 'white',
              fontWeight: '600'
            }}>
              <td colSpan={2} style={tableFooterStyle}>
                SUMMARY ({data.summary?.totalPrograms ?? 0} Programs)
              </td>
              <td colSpan={3} style={tableFooterStyle}>
                Total Enrollments: {data.summary?.totalEnrollments ?? 0}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

// Table Styles
const tableHeaderStyle = {
  padding: '16px 20px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: '600',
  color: COLORS.textPrimary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const tableCellStyle = {
  padding: '16px 20px',
  fontSize: '14px',
  color: COLORS.textSecondary
};

const tableFooterStyle = {
  padding: '16px 20px',
  fontSize: '14px'
};

const badgeStyle = (color) => ({
  background: `${color}20`,
  color: color,
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: '600',
  display: 'inline-block'
});

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

const ReportsDashboard = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Managerial Reports State
  const [patientStats, setPatientStats] = useState(null);
  const [financialOverview, setFinancialOverview] = useState(null);
  const [caregiverWorkload, setCaregiverWorkload] = useState(null);
  const [programEnrollment, setProgramEnrollment] = useState(null);
  const [paymentStats, setPaymentStats] = useState(null);
  const [reportGeneration, setReportGeneration] = useState(null);
  const [organizationActivity, setOrganizationActivity] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState(null);
  
  // Detailed Reports State
  const [caregiverPerformance, setCaregiverPerformance] = useState(null);
  const [financialAidByOrg, setFinancialAidByOrg] = useState(null);
  const [patientProgramEnrollment, setPatientProgramEnrollment] = useState(null);

  useEffect(() => {
    loadManagerialReports();
    loadDetailedReports();
  }, []);

  const loadManagerialReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ps, fo, cw, pe, pst, rg, oa, mr] = await Promise.all([
        fetchReport('managerial/patient-statistics'),
        fetchReport('managerial/financial-overview'),
        fetchReport('managerial/caregiver-workload'),
        fetchReport('managerial/program-enrollment'),
        fetchReport('managerial/payment-statistics'),
        fetchReport('managerial/report-generation'),
        fetchReport('managerial/organization-activity'),
        fetchReport('managerial/medical-records')
      ]);
      
      setPatientStats(ps);
      setFinancialOverview(fo);
      setCaregiverWorkload(cw);
      setProgramEnrollment(pe);
      setPaymentStats(pst);
      setReportGeneration(rg);
      setOrganizationActivity(oa);
      setMedicalRecords(mr);
    } catch (error) {
      console.error('Error loading managerial reports:', error);
      setError('Failed to load managerial reports. Please check your API connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadDetailedReports = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading detailed reports...');
      const endpoints = [
        'caregiver-performance',
        'financial-aid-by-organization',
        'patient-program-enrollment'
      ];

      const settled = await Promise.allSettled(
        endpoints.map((name) => fetchReport(`detailed/${name}`))
      );

      settled.forEach((result, i) => {
        const name = endpoints[i];
        if (result.status === 'fulfilled') {
          console.debug(`Loaded detailed/${name}:`, result.value);
          if (i === 0) setCaregiverPerformance(result.value);
          if (i === 1) setFinancialAidByOrg(result.value);
          if (i === 2) setPatientProgramEnrollment(result.value);
        } else {
          console.error(`Failed to load detailed/${name}:`, result.reason);
          const empty = { rows: [], summary: {}, generatedAt: null, _failed: true };
          if (i === 0) setCaregiverPerformance(empty);
          if (i === 1) setFinancialAidByOrg(empty);
          if (i === 2) setPatientProgramEnrollment(empty);
        }
      });

      const failed = settled.map((r, i) => (r.status === 'rejected' ? endpoints[i] : null)).filter(Boolean);
      if (failed.length) {
        const msg = `Some detailed reports failed to load: ${failed.join(', ')}`;
        console.warn(msg);
        setError(msg);
      }
    } catch (error) {
      console.error('Error loading detailed reports:', error);
      setError('Failed to load detailed reports. Please check your API connection.');
      setCaregiverPerformance({ rows: [], summary: {}, generatedAt: null, _failed: true });
      setFinancialAidByOrg({ rows: [], summary: {}, generatedAt: null, _failed: true });
      setPatientProgramEnrollment({ rows: [], summary: {}, generatedAt: null, _failed: true });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${COLORS.background} 0%, white 50%, ${COLORS.background} 100%)`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      paddingTop: '60px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)',
            border: `2px solid ${COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Activity size={32} color="white" />
            </div>
            <div>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: COLORS.textPrimary,
                margin: 0,
                marginBottom: '8px'
              }}>
                AbleEase Reports
              </h1>
              <p style={{ 
                fontSize: '16px', 
                color: COLORS.textMuted,
                margin: 0
              }}>
                Comprehensive analytics and insights for better healthcare management
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '1px solid #fecaca',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{error}</span>
          </div>
        )}

        {/* All Reports (single view) */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(5, 150, 105, 0.06)',
            border: `1px solid ${COLORS.border}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Activity size={20} color={COLORS.primary} />
              <div>
                <div style={{ fontWeight: 700, color: COLORS.textPrimary }}>All Reports</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted }}>Managerial & Detailed reports shown below</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '400px',
            gap: '16px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: `4px solid ${COLORS.border}`,
              borderTop: `4px solid ${COLORS.primary}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
            <p style={{ color: COLORS.textMuted, fontSize: '14px' }}>
              Loading reports...
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Managerial content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Top Stats Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px' 
              }}>
                {patientStats && (
                  <StatCard
                    title="Total Patients"
                    value={patientStats.totalPatients}
                    subtitle={`Avg Age: ${patientStats.averageAge} years`}
                    icon={Users}
                    color={COLORS.primary}
                    trend={5}
                  />
                )}
                {financialOverview && (
                  <StatCard
                    title="Total Aid Applications"
                    value={financialOverview.totalApplications}
                    subtitle={`${financialOverview.approvalRate}% Approved`}
                    icon={DollarSign}
                    color={COLORS.primaryLight}
                    trend={12}
                  />
                )}
                {caregiverWorkload && (
                  <StatCard
                    title="Total Caregivers"
                    value={caregiverWorkload.totalCaregivers}
                    subtitle={`Avg: ${caregiverWorkload.averagePatientsPerCaregiver} patients`}
                    icon={Heart}
                    color={COLORS.primary}
                    trend={3}
                  />
                )}
                {programEnrollment && (
                  <StatCard
                    title="Active Programs"
                    value={programEnrollment.activePrograms}
                    subtitle={`${programEnrollment.totalEnrolledPatients} enrolled`}
                    icon={Activity}
                    color={COLORS.primaryLight}
                    trend={8}
                  />
                )}
              </div>

              {/* Charts Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
                <PatientStatisticsCard data={patientStats} />
                <FinancialOverviewCard data={financialOverview} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
                <CaregiverWorkloadCard data={caregiverWorkload} />
                <PaymentStatisticsCard data={paymentStats} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
                <ProgramEnrollmentCard data={programEnrollment} />
                <ReportGenerationCard data={reportGeneration} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
                <OrganizationActivityCard data={organizationActivity} />
                <MedicalRecordsCard data={medicalRecords} />
              </div>
            </div>

            {/* Detailed content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>Detailed Reports</h3>
              {caregiverPerformance && <CaregiverPerformanceTable data={caregiverPerformance} />}
              {financialAidByOrg && <FinancialAidByOrgTable data={financialAidByOrg} />}
              {patientProgramEnrollment && <PatientProgramEnrollmentTable data={patientProgramEnrollment} />}

              {!caregiverPerformance && !financialAidByOrg && !patientProgramEnrollment && !loading && (
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '48px 32px',
                  textAlign: 'center',
                  border: `2px dashed ${COLORS.border}`,
                  boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)'
                }}>
                  <Activity size={48} color={COLORS.textMuted} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p style={{ fontSize: '18px', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '8px' }}>
                    No Detailed Data Available
                  </p>
                  <p style={{ fontSize: '14px', color: COLORS.textMuted }}>
                    Detailed reports are empty or failed to load.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsDashboard;