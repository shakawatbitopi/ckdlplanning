using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class ProductionDetailsDBModel
    {
        public int PRMasterID { get; set; }
        public string PRID { get; set; }
        public string CompanyName { get; set; }
        public string BuyerName { get; set; }
        public string FileRefID { get; set; }
        public string ProductType { get; set; }
        public string TargetDate { get; set; }
        public int PrQty { get; set; }
        public decimal SAM { get; set; }
        public decimal OrganizationEfficiency { get; set; }
        public int NoOfWorkStation { get; set; }
        public int OrderQty { get; set; }
        public int WorkTime { get; set; }
        public decimal ExcessQty { get; set; }
        public string BulletinID { get; set; }
        public string Company { get; set; }
        public string UnitName { get; set; }
        public string LineNumber { get; set; }
        public string WorkStation { get; set; }
        public string AverageEfficiency { get; set; }
        public string TargetQty { get; set; }
        public int TotalWorkMinutes { get; set; }
        public int SelectedQty { get; set; }
        public int PlannedProduction { get; set; }
        public int TotalWorkStation { get; set; }
        public int HourlyTarget100PercentEffeincy { get; set; }
        public decimal OrgEfficiency { get; set; }
        public int HourlyTargetOrgPercentEffeincy { get; set; }
        public int DailyTargetPerLine { get; set; }
        public int FirstDayOutput { get; set; }
        public string IncrementType { get; set; }
        public int IncrementQty { get; set; }
        public int LineDaysRequire { get; set; }
        public int MinLineDays { get; set; }
        public int LineAllocated { get; set; }
        public int FinishDays { get; set; }
        public string ExFactoryDate { get; set; }
        public string PlanStartDate { get; set; }
        public string PlanEndDate { get; set; }
        public string PriorityNo { get; set; }
        public string StyleID { get; set; }
        public string Style { get; set; }
        public string Buyer { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string TotalPlanQty { get; set; }
        public string Status { get; set; }
        public int HourlyTarget { get; set; }
        public int DailyLineTarget { get; set; }
        public int WorkingMinutes { get; set; }
        public string LineNumbers { get; set; }
        public string PCD { get; set; }
        public string ProduceQty { get; set; }
        public string IsLineExists { get; set; }
        public string HourlyProductionOrgEff { get; set; }
        public string DailyProductionOrgEff { get; set; }
        public string StyleCriticality { get; set; }
        public string DayNo { get; set; }
        public string MatrixEfficiency { get; set; }
        public string CompanyID { get; set; }
        public string StyleType { get; set; }
        public string TotalLineCount { get; set; }
        public int MatrixCount { get; set; }
        public bool IsCheck { get; set; }
        public bool IsFixed { get; set; }
        public LineInformationDBModel[] arrLineInformationDBModel { get; set; }
    }

    public class LineInformationDBModel {
        public int LineNumber { get; set; }
        public int WorkStation { get; set; }
        public decimal AverageEfficiency { get; set; }
        public decimal PriorityNo { get; set; }
        public int TargetQty { get; set; }
        public int HourlyTarget { get; set; }
        public int DailyLineTarget { get; set; }
        public int WorkingMinutes { get; set; }
        public int IncrementQty { get; set; }
        public int FirstDayOutput { get; set; }
        public bool IsFixed { get; set; }
        public DateTime PlanStartDate { get; set; }
        public DateTime PlanEndDate { get; set; }
    }
}
