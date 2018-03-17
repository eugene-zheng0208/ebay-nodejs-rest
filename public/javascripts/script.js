
<script type="text/javascript">
        $(document).ready(function () {
            // prepare the data
        //    var data = generatedata(200);
        var url = "http://localhost:3003/listAllSubCategory?category=electronics";
            // prepare the data
            var source =
            {
                datatype: "json",
                datafields: [
                    { name: 'subcategoryid', type: 'number' },
                    { name: 'categoryid', type: 'number' },
                    { name: 'name', type: 'string' }
                ],
                id: 'id',
                url: url
            };

          /*  $("#jqxgrid").jqxGrid(
            {
                width: 850,
                source: dataAdapter,
                columnsresize: true,
                columns: [
                  { text: 'subcategoryId', datafield: 'subcategoryId', width: 250 },
                  { text: 'categoryId', datafield: 'categoryId', width: 250 },
                  { text: 'name', datafield: 'name', width: 180 }
              ]
            });*/
          /*var source =
            {
                localdata: data,
                datatype: "array",
                datafields:
                [
                    { name: 'firstname', type: 'string' },
                    { name: 'lastname', type: 'string' },
                    { name: 'productname', type: 'string' }
                ],
                updaterow: function (rowid, rowdata, commit) {
                    // synchronize with the server - send update command
                    // call commit with parameter true if the synchronization with the server is successful
                    // and with parameter false if the synchronization failder.
                    commit(true);
                }
            };*/
            // initialize the input fields.
            $("#firstName").jqxInput({ theme: theme });
            $("#lastName").jqxInput({ theme: theme });
            $("#product").jqxInput({ theme: theme });

            $("#firstName").width(150);
            $("#firstName").height(23);
            $("#lastName").width(150);
            $("#lastName").height(23);
            $("#product").width(150);
            $("#product").height(23);

          console.log(source);
           var dataAdapter = new $.jqx.dataAdapter(source);
           console.log(dataAdapter);
            var editrow = -1;
            // initialize jqxGrid
            $("#jqxgrid").jqxGrid(
            {
                width: 850,
                source: dataAdapter,
                pageable: true,
                autoheight: true,
                columns: [
                  { text: 'First Name', datafield: 'subcategoryid', width: 200 },
                  { text: 'Last Name', datafield: 'categoryid', width: 200 },
                  { text: 'Product', datafield: 'name', width: 190 },
                  { text: 'Edit', datafield: 'Edit', columntype: 'button', cellsrenderer: function () {
                     return "Edit";
                  }, buttonclick: function (row) {
                     // open the popup window when the user clicks a button.
                     editrow = row;
                     var offset = $("#jqxgrid").offset();
                     $("#popupWindow").jqxWindow({ position: { x: parseInt(offset.left) + 60, y: parseInt(offset.top) + 60 } });
                     // get the clicked row's data and initialize the input fields.
                     var dataRecord = $("#jqxgrid").jqxGrid('getrowdata', editrow);
                     $("#firstName").val(dataRecord.subcategoryid);
                     $("#lastName").val(dataRecord.categoryid);
                     $("#product").val(dataRecord.name);
                     // show the popup window.
                     $("#popupWindow").jqxWindow('open');
                 }
                 }
                ]
            });
            // initialize the popup window and buttons.
            $("#popupWindow").jqxWindow({
                width: 250, resizable: false,  isModal: true, autoOpen: false, cancelButton: $("#Cancel"), modalOpacity: 0.01
            });
            $("#popupWindow").on('open', function () {
                $("#firstName").jqxInput('selectAll');
            });

            $("#Cancel").jqxButton({ theme: theme });
            $("#Save").jqxButton({ theme: theme });
            // update the edited row when the user clicks the 'Save' button.
            $("#Save").click(function () {
                if (editrow >= 0) {
                    var row = { subcategoryid: $("#firstName").val(), categoryid: $("#lastName").val(), name: $("#product").val()
                    };
                    console.log(row);
                    var rowID = $('#jqxgrid').jqxGrid('getrowid', editrow);
                    $('#jqxgrid').jqxGrid('updaterow', rowID, row);
                    $("#popupWindow").jqxWindow('hide');
                }
            });
        });
</script>
 
<script type="text/javascript" src="/scripts/jquery-1.11.1.min.js" />
<script type="text/javascript" src="/jqwidgets/jqxcore.js"></script>
<script type="text/javascript" src="/jqwidgets/jqxdata.js"></script>
<script type="text/javascript" src="/jqwidgets/jqxbuttons.js"></script>
<script type="text/javascript" src="/jqwidgets/jqxscrollbar.js"></script>
<script type="text/javascript" src="/jqwidgets/jqxmenu.js"></script>
<script type="text/javascript" src="/jqwidgets/jqxgrid.js"></script>
<script type="text/javascript" src="/jqwidgets/jqxgrid.pager.js"></script>
<script type="text/javascript" src="/jqwidgets/jqxgrid.selection.js"></script>
<script type="text/javascript" src="/jqwidgets/jqxnumberinput.js"></script>
<script type="text/javascript" src="/jqwidgets/jqxwindow.js"></script>
<script type="text/javascript" src="/jqwidgets/jqxlistbox.js"></script>
<script type="text/javascript" src="/jqwidgets/jqxdropdownlist.js"></script>
<script type="text/javascript" src="/jqwidgets/jqxinput.js"></script>
<script type="text/javascript" src="/scripts/demos.js"></script>
<script type="text/javascript" src="/generatedata.js"></script>
<script type="text/javascript" src="/jqwidgets/jqxgrid.columnsresize.js"></script>