using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class PlanningDBModel
    {
        public string FileRefID { get; set; }
        public string PriorityNo { get; set; }
        public string OrderQty { get; set; }
        public string FirstPCDDate { get; set; }
        public string LastPCDDate { get; set; }
        public string TargetDate { get; set; }
        public string FirstShipDate { get; set; }
        public string LastShipDate { get; set; }
        public string SAM { get; set; }
        public string WorkStation { get; set; }
        public string WorkTime { get; set; }
        public string StyleID { get; set; }
        public string ProductTypes { get; set; }
        public string BuyerName { get; set; }
        public string BuyerDepartment { get; set; }
        public string Company { get; set; }
        public string UnitName { get; set; }
        public string LineNumber { get; set; }
        public string AverageEfficiency { get; set; }
        public string TargetQty { get; set; }
        public string IncrementQty { get; set; }
        public string HourlyTarget { get; set; }
        public string DailyTargetPerLine { get; set; }
        public string TotalDaysRequired { get; set; }
        public string RowID { get; set; }
        public string SeqNo { get; set; }
        public string ExportOrderID { get; set; }
        public string SizeGroup { get; set; }
        public string UOM { get; set; }
        public string Destination { get; set; }
        public string ShipMode { get; set; }
        public string ExportPONo { get; set; }
        public string PCD { get; set; }
        public string ExfactoryDate { get; set; }
        public string ShipDate { get; set; }
        public string PRQty { get; set; }
        public string RemainingQty { get; set; }
        public string SelectedQty { get; set; }
        public string IsCheck { get; set; }
        public string BulletinID { get; set; }
        public string PRMasterID { get; set; }
        public string PRID { get; set; }
        public string Buyer { get; set; }
        public string ProductType { get; set; }
        public string PlannedProduction { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string ProcessBy { get; set; }
        public string ProcessDate { get; set; }
    }
}
