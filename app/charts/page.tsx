"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { AreaChartStacked } from '@/components/charts/area-chart-stacked';
import { BarChartMixed } from '@/components/charts/bar-chart-mixed';
import { InteractiveBarChart } from '@/components/charts/interactive-bar-chart';
import { LineChartMultiple } from '@/components/charts/line-chart-multiple';
import { RadarChartSimple } from '@/components/charts/radar-chart-simple';
import { RadialChartGrid } from '@/components/charts/radial-chart-grid';
import { RadialShapeChart } from '@/components/charts/radial-shape-chart';
import { RadialStackedChart } from '@/components/charts/radial-stacked-chart';
import { RadialTextChart } from '@/components/charts/radial-text-chart';
import { BarChart3, TrendingUp, Activity, PieChart } from 'lucide-react';

const chartSections = [
  {
    title: "Bar Charts",
    description: "Interactive and mixed bar chart visualizations",
    icon: BarChart3,
    charts: [
      { 
        component: InteractiveBarChart, 
        name: "Interactive Bar Chart",
        description: "Click and hover interactions with dynamic data"
      },
      { 
        component: BarChartMixed, 
        name: "Mixed Bar Chart",
        description: "Combined data sets in a single chart view"
      },
    ]
  },
  {
    title: "Line & Area Charts", 
    description: "Trend analysis and time-series visualizations",
    icon: TrendingUp,
    charts: [
      { 
        component: LineChartMultiple, 
        name: "Multiple Line Chart",
        description: "Compare multiple data series over time"
      },
      { 
        component: AreaChartStacked, 
        name: "Stacked Area Chart",
        description: "Layered data visualization for cumulative values"
      },
    ]
  },
  {
    title: "Radial Charts",
    description: "Circular and pie chart representations", 
    icon: PieChart,
    charts: [
      { 
        component: RadialChartGrid, 
        name: "Radial Grid Chart",
        description: "Grid-based circular data visualization"
      },
      { 
        component: RadialShapeChart, 
        name: "Radial Shape Chart",
        description: "Custom shaped radial presentations"
      },
      { 
        component: RadialStackedChart, 
        name: "Radial Stacked Chart",
        description: "Layered circular data representation"
      },
      { 
        component: RadialTextChart, 
        name: "Radial Text Chart",
        description: "Text-enhanced radial visualizations"
      },
    ]
  },
  {
    title: "Specialized Charts",
    description: "Radar and advanced chart types",
    icon: Activity,
    charts: [
      { 
        component: RadarChartSimple, 
        name: "Simple Radar Chart",
        description: "Multi-dimensional data comparison"
      },
    ]
  }
];

export default function ChartsPage() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Charts & Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Interactive data visualizations and chart components
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="space-y-12">
        {chartSections.map((section) => (
          <section key={section.title} className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <section.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {section.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {section.description}
                </p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {section.charts.map((chart) => (
                <div
                  key={chart.name}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Chart Header */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {chart.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {chart.description}
                    </p>
                  </div>

                  {/* Chart Content */}
                  <div className="p-4">
                    <chart.component />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center py-8 border-t border-slate-200 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-400">
          Built with Recharts and designed for modern dashboards
        </p>
      </div>
    </DashboardLayout>
  );
}