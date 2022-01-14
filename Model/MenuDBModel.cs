using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class MenuDBModel
    {
        public int MenuCategoryID { get; set; }
        public string CategoryName { get; set; }
        public int MenuSubCategoryID { get; set; }
        public bool IsChecked { get; set; }
        public bool IsSelect { get; set; }
        public bool IsInsert { get; set; }
        public bool IsEdit { get; set; }
        public bool IsDelete { get; set; }
        public string MenuName { get; set; }
        public string MenuUrl { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public decimal SequenceNo { get; set; }
        public bool IsActive { get; set; }
        public UserMenuPermissionDBModel[] arrUserMenuPermissionDBModel { get; set; }
    }
    public class UserMenuPermissionDBModel {
        public int MenuSubCategoryID { get; set; }
        public bool IsSelect { get; set; }
        public bool IsInsert { get; set; }
        public bool IsEdit { get; set; }
        public bool IsDelete { get; set; }
    }
}
