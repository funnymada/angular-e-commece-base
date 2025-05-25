export interface AnalyticsData {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    salesByDay: SalesByDay[];
    salesByCategory: SalesByCategory[];
  }
  
  export interface SalesByDay {
    date: string;
    sales: number;
  }
  
  export interface SalesByCategory {
    categoryName: string;
    sales: number;
  }
  