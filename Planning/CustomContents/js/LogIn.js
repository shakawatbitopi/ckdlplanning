$(function () {
    $(document).delegate('#btnLogin', 'click', function (e) {
        e.preventDefault();
        GetLoginInfo();
    });
});

function GetLoginInfo() {
    var url = "";
    var _isError = 0;
    var _UserName = $("#username").val();
    var _Password = $("#pass").val();
    if (_UserName == "") {
        $("#username").addClass('customError');
        _isError = 1;
    }
    else {
        $("#username").removeClass('customError');
    }
    if (_Password == "") {
        $("#pass").addClass('customError');
        _isError = 1;
    }
    else {
        $("#pass").removeClass('customError');
    }

    if (_isError == 1) {
        return false;
    }

    var user = { UserName: _UserName, Password: _Password };
    $.ajax({
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        url: baseURL + '/LogIn/GetLogInInfo',
        data: JSON.stringify(user),
        async: false,
        dataType: 'json',
        success: function (data) {
            if (data.Success == 'True') {                
                window.location.href = baseURL + "/Dashboard/Home";
            }
            else {
                alert("User Name Or Password Error..!");
            }
        }
    });
}