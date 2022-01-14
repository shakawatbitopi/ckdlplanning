using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class ProductionReferenceDBModel
    {
        public string Code { get; set; }
        public string Value { get; set; }
        public string BuyerID { get; set; }
        public string ProductType { get; set; }
        public string IsCheck { get; set; }
        public string RowID { get; set; }
        public string SeqNo { get; set; }
        public string FileRefID { get; set; }
        public string ExportOrderID { get; set; }
        public string SizeGroup { get; set; }
        public string UOM { get; set; }
        public string Destination { get; set; }
        public string UnitName { get; set; }
        public string ShipMode { get; set; }
        public string ExportPONo { get; set; }
        public string PCD { get; set; }
        public string TargetDate { get; set; }
        public string ExfactoryDate { get; set; }
        public string ShipDate { get; set; }
        public string OrderQty { get; set; }
        public string PRQty { get; set; }
        public string BalanceQty { get; set; }
        public string RemainingQty { get; set; }
        public string SelectedQty { get; set; }
        public string PRID { get; set; }
        public string StyleName { get; set; }
        public string CompanyID { get; set; }
        public string CompanyName { get; set; }
        public string BuyerName { get; set; }
        public string Status { get; set; }
        public string StyleID { get; set; }
        public string FileRefNo { get; set; }
        public string Style { get; set; }
        public int PRMasterID { get; set; }
        public string TotalWorkMinutes { get; set; }
        public string PlannedProduction { get; set; }
        public string OrgEfficiency { get; set; }
        public string IncrementType { get; set; }
        public string FirstDayOutput { get; set; }        
        public string IncrementQty { get; set; }
        public string LineNumber { get; set; }
        public string WorkStation { get; set; }
        public string WorkingMinutes { get; set; }
        public string AverageEfficency { get; set; }
        public string TargetQty { get; set; }
        public string PlanStartDate { get; set; }
        public string HourlyTarget { get; set; }
        public string DailyLineTarget { get; set; }
        public string LineNumberList { get; set; }
        public int PRMatrixID { get; set; }
        public int StartDay { get; set; }
        public int EndDay { get; set; }
        public decimal MatrixEfficiency { get; set; }
        public string AddedBy { get; set; }
        public string DateAdded { get; set; }
        public string SAM { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string ExportOrderStatus { get; set; }
        public string BulletinID { get; set; }
        public string StyleType { get; set; }
        public string ProduceQty { get; set; }
        public string PRMasterIDList { get; set; }
        public string ParentExportOrderID { get; set; }
        public decimal ExcessQty { get; set; }
        public int LineAllocated { get; set; }
        public int QuantityFactor { get; set; }
        public int TotalDays { get; set; }
        public decimal PriorityNo { get; set; }
        public bool IsRepeatedOrder { get; set; }
        public bool ISEOCheck { get; set; }
        public EOInformationDBModel[] arrEOInformationDBModel { get; set; }
        public LineInformationDBModel[] arrLineInformationDBModel { get; set; }
    }
    public class EOInformationDBModel
    {
        public string ExportOrderID { get; set; }
        public int SelectedQty { get; set; }
    }
}
