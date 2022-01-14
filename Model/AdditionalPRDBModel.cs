using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class AdditionalPRDBModel
    {
        public int APRMasterID { get; set; }
        public string APRID { get; set; }
        public string SLNO { get; set; }
        public string CompanyID { get; set; }
        public string CompanyName { get; set; }
        public string BuyerID { get; set; }
        public string BuyerName { get; set; }
        public string StyleID { get; set; }
        public string FileRefID { get; set; }
        public string FileRefNo { get; set; }
        public int Qty { get; set; }
        public string PCD { get; set; }
        public double SAM { get; set; }
        public double CM { get; set; }
        public double FOB { get; set; }
        public string Reason { get; set; }
        public int TotalWorkMinutes { get; set; }
        public string StyleType { get; set; }
        public decimal PriorityNo { get; set; }
        public bool IsRepeatedOrder { get; set; }
        public string AddedBy { get; set; }
        public string DateAdded { get; set; }
        public LineInformationDBModel[] arrLineInformationDBModel { get; set; }

    }

    public class AdditionalPRMasterDDL
    {
        public List<AdditionalPRCompanyDBModel> CompanyList { get; set; }
        public List<AdditionalPRBuyerDBModel> BuyerList { get; set; }
    }

    public class AdditionalPRCompanyDBModel 
    {
        public string Code { get; set; }
        public string Value { get; set; }
    }

    public class AdditionalPRBuyerDBModel
    {
        public string Code { get; set; }
        public string Value { get; set; }
    }

    public class AdditionalFileRefDBModel
    {
        public string Code { get; set; }
        public string Value { get; set; }
    }
}
