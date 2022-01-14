using Common;
using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace LIB
{
    public class ProductionReferenceItem
    {
        ProductionReferenceList _objList;
        public DataSet LoadMasterInformation()
        {
            try
            {
                _objList = new ProductionReferenceList();
                return _objList.LoadMasterInformation();
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                _objList = null;
            }
        }
        public List<ProductionReferenceDBModel> LoadFileRefData(ProductionReferenceDBModel _dbModel)
        {
            _objList = new ProductionReferenceList();
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.LoadFileRefData(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      Code = row["Code"].ToString(),
                                      Value = row["Value"].ToString()
                                  }).ToList();

                }
                return _modelList;
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                _modelList = null;
            }
        }
        public List<ProductionReferenceDBModel> ConvertDataTableToModel(DataTable dt)
        {
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      Code = row["Code"].ToString(),
                                      Value = row["Value"].ToString()
                                  }).ToList();

                }
                return _modelList;
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                _modelList = null;
            }
        }

        public List<ProductionReferenceDBModel> LoadExportOrder(ProductionReferenceDBModel _dbModel)
        {
            _objList = new ProductionReferenceList();
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = _objList.LoadExportOrder(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      IsCheck = row["IsCheck"].ToString(),
                                      RowID = row["RowID"].ToString(),
                                      SeqNo = row["SeqNo"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      StyleID = row["StyleID"].ToString(),
                                      ExportOrderID = row["ExportOrderID"].ToString(),
                                      SizeGroup = row["SizeGroup"].ToString(),
                                      UOM = row["UOM"].ToString(),
                                      Destination = row["Destination"].ToString(),
                                      UnitName = row["UnitName"].ToString(),
                                      ShipMode = row["ShipMode"].ToString(),
                                      ExportPONo = row["ExportPONo"].ToString(),
                                      PCD = row["PCD"].ToString(),
                                      TargetDate = row["TargetDate"].ToString(),
                                      ExfactoryDate = row["ExfactoryDate"].ToString(),
                                      ShipDate = row["ShipDate"].ToString(),
                                      OrderQty = row["OrderQty"].ToString(),
                                      PRQty = row["PRQty"].ToString(),
                                      RemainingQty = row["RemainingQty"].ToString(),
                                      SelectedQty = row["SelectedQty"].ToString(),
                                      ExportOrderStatus = row["ExportOrderStatus"].ToString()
                                  }).ToList();
                }
                return _modelList;
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                _modelList = null;
            }
        }
        public string SaveProductionReference(ProductionReferenceDBModel _dbModel)
        {
            try
            {
                _objList = new ProductionReferenceList();
                return _objList.SaveProductionReference(_dbModel);
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                _objList = null;
            }
        }
        public List<ProductionReferenceDBModel> LoadAllPRInformation()
        {
            _objList = new ProductionReferenceList();
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = _objList.LoadAllPRInformation();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      PRID = row["PRID"].ToString(),
                                      CompanyName = row["CompanyName"].ToString(),
                                      BuyerName = row["BuyerName"].ToString(),
                                      ProductType = row["ProductType"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      PRQty = row["PRQty"].ToString(),
                                      Style = row["Style"].ToString()
                                  }).ToList();
                }
                return _modelList;
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                _modelList = null;
            }
        }
        public DataSet LoadSelectedPRInformation(ProductionReferenceDBModel _dbModel)
        {
            try
            {
                _objList = new ProductionReferenceList();
                return _objList.LoadSelectedPRInformation(_dbModel);
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                _objList = null;
            }
        }
        public List<ProductionReferenceDBModel> LoadMasterModelList(DataTable dt)
        {
           
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {                
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      PRID = row["PRID"].ToString(),
                                      CompanyID = row["CompanyID"].ToString(),
                                      BuyerID = row["BuyerID"].ToString(),
                                      ProductType = row["ProductType"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      Status = row["Status"].ToString()
                                  }).ToList();
                }
                return _modelList;
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                _modelList = null;
            }
        }      

        public List<ProductionReferenceDBModel> LoadChildModelList(DataTable dt)
        {
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      IsCheck = row["IsCheck"].ToString(),
                                      RowID = row["RowID"].ToString(),
                                      SeqNo = row["SeqNo"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      StyleID = row["StyleID"].ToString(),
                                      ExportOrderID = row["ExportOrderID"].ToString(),
                                      SizeGroup = row["SizeGroup"].ToString(),
                                      UOM = row["UOM"].ToString(),
                                      Destination = row["Destination"].ToString(),
                                      UnitName = row["UnitName"].ToString(),
                                      ShipMode = row["ShipMode"].ToString(),
                                      ExportPONo = row["ExportPONo"].ToString(),
                                      PCD = row["PCD"].ToString(),
                                      TargetDate = row["TargetDate"].ToString(),
                                      ExfactoryDate = row["ExfactoryDate"].ToString(),
                                      ShipDate = row["ShipDate"].ToString(),
                                      OrderQty = row["OrderQty"].ToString(),
                                      PRQty = row["PRQty"].ToString(),
                                      RemainingQty = row["RemainingQty"].ToString(),
                                      SelectedQty = row["SelectedQty"].ToString(),
                                      ExportOrderStatus = row["ExportOrderStatus"].ToString()
                                  }).ToList();
                }
                return _modelList;
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                _modelList = null;
            }
        }
        public List<ProductionReferenceDBModel> LoadCancelledEO()
        {
            _objList = new ProductionReferenceList();
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.LoadCancelledEO();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      PRMasterID =Convert.ToInt32(row["PRMasterID"].ToString()),
                                      PRID = row["PRID"].ToString(),
                                      ExportOrderID = row["ExportOrderID"].ToString(),
                                      PRQty = row["PRQty"].ToString(),
                                      OrderQty = row["OrderQty"].ToString(),
                                      Status = row["Status"].ToString(),
                                      CompanyID = row["CompanyID"].ToString(),
                                      CompanyName = row["CompanyName"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      FileRefNo = row["FileRefNo"].ToString(),
                                  }).ToList();

                }
                return _modelList;
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                _modelList = null;
            }
        }

        public DataTable LoadCancelledEOCount()
        {
            _objList = new ProductionReferenceList();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.LoadCancelledEOCount();
                
                return dt;
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
              
            }
        }

        public List<ProductionReferenceDBModel> LoadEOQtyStatus()
        {
            _objList = new ProductionReferenceList();
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.LoadEOQtyStatus();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      PRID = row["PRID"].ToString(),
                                      CompanyID = row["CompanyID"].ToString(),
                                      CompanyName = row["CompanyName"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      FileRefNo = row["FileRefNo"].ToString(),
                                      ExportOrderID = row["ExportOrderID"].ToString(),
                                      PRQty = row["PRQty"].ToString(),
                                      OrderQty = row["EOOrderQty"].ToString(),
                                      BalanceQty = row["BalanceQty"].ToString(),
                                  }).ToList();

                }
                return _modelList;
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                _modelList = null;
            }
        }
        public int DeleteSelectedPRInformation(ProductionReferenceDBModel _dbModel)
        {
            try
            {
                _objList = new ProductionReferenceList();
                return _objList.DeleteSelectedPRInformation(_dbModel);
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                _objList = null;
            }
        }
        public List<ProductionReferenceDBModel> LoadCancelledEOLineNo(ProductionReferenceDBModel _dbModel)
        {
            _objList = new ProductionReferenceList();
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.LoadCancelledEOLineNo(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      LineNumber = row["LineNumber"].ToString(),
                                      TargetQty = row["TargetQty"].ToString()
                                  }).ToList();

                }
                return _modelList;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                _modelList = null;
            }
        }

        public int UpdateCancelledEOLineNo(DataTable dtEO)
        {
            try
            {
                _objList = new ProductionReferenceList();
                return _objList.UpdateCancelledEOLineNo(dtEO);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                _objList = null;
            }
        }
        public List<ProductionReferenceDBModel> GetPREOStatus(ProductionReferenceDBModel _dbModel)
        {
            _objList = new ProductionReferenceList();
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.GetPREOStatus(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"]),
                                      ISEOCheck = Convert.ToBoolean(row["ISCheck"]),
                                      PRID = row["PRID"].ToString(),
                                      ExportOrderID = row["ExportOrderID"].ToString(),
                                      PRQty = row["PRQty"].ToString(),
                                      TargetQty = row["EOQty"].ToString(),
                                      SelectedQty = row["SelectedQty"].ToString(),
                                      RemainingQty = row["RemainQty"].ToString(),
                                      ExcessQty = Convert.ToDecimal(row["ExcessQty"]),
                                      PlannedProduction = row["PlannedProduction"].ToString(),
                                      ExportOrderStatus = row["ExportOrderStatus"].ToString(),
                                      ParentExportOrderID = row["ParentExportOrderID"].ToString(),
                                      QuantityFactor = Convert.ToInt32(row["QuantityFactor"]),
                                  }).ToList();

                }
                return _modelList;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                _modelList = null;
            }
        }
    }
}
