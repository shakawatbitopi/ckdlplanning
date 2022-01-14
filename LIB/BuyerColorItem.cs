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
    public class BuyerColorItem
    {
        BuyerColorList _objList;
        public int SaveBuyerColor(BuyerColorDBModel _dbModel)
        {
            try
            {
                _objList = new BuyerColorList();
                return _objList.SaveBuyerColor(_dbModel);
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
        public List<BuyerColorDBModel> LoadAllBuyerColor()
        {
            _objList = new BuyerColorList();
            List<BuyerColorDBModel> _modelList = new List<BuyerColorDBModel>();
            try
            {
                DataTable dt = _objList.LoadAllBuyerColor();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new BuyerColorDBModel
                                  {
                                      BuyerColorID = Convert.ToInt32(row["BuyerColorID"].ToString()),
                                      BuyerID = row["BuyerID"].ToString(),
                                      ColorCode = row["ColorCode"].ToString()
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
        public List<BuyerColorDBModel> LoadSelectedBuyerColor(BuyerColorDBModel _dbModel)
        {
            _objList = new BuyerColorList();
            List<BuyerColorDBModel> _modelList = new List<BuyerColorDBModel>();
            try
            {
                DataTable dt = _objList.LoadSelectedBuyerColor(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new BuyerColorDBModel
                                  {
                                      BuyerColorID = Convert.ToInt32(row["BuyerColorID"].ToString()),
                                      BuyerID = row["BuyerID"].ToString(),
                                      ColorCode = row["ColorCode"].ToString()
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
        public int DeleteBuyerColor(BuyerColorDBModel _dbModel)
        {
            try
            {
                _objList = new BuyerColorList();
                return _objList.DeleteBuyerColor(_dbModel);
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
    }
}
