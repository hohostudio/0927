sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast) {
        "use strict";

        return Controller.extend("sap.sync.odata.controller.View1", {
            onInit: function () {
                var oData = { 
                    salesOrderNum : null,
                    salesOrderMemo : null
                };

                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel,"view");

            },
            onCreate: function() {
                var oModel = this.getView().getModel();// oDataModel 객체
                var oViewModel = this.getView().getModel("view");
                var sSONUM = oViewModel.getProperty("/salesOrderNum");
                var sMemo = oViewModel.getProperty("/salesOrderMemo");

                var oCreateData = {
                    Sonum : sSONUM,
                    Memo : sMemo
                }

                //바로 추가할 때 사용하는 구문
                oModel.create("/SalesOrderSet", oCreateData, {
                    success : function(){
                        oViewModel.setProperty("/salesOrderNum", null);
                        oViewModel.setProperty("/salesOrderMemo", null);
                        MessageToast.show("저장되었습니다.");//manifest에 존재하지 않는 경우, 직접호출시 에러가 날 수 있다.
                    }
                });

            

                //ui5 framework odataV2 모델 api(메소드 기능)으로 생성요청

                //바로 추가하지 않고 submitChanges을 만나야 추가되는 구문

                //생성요청 경로 : entitySet 경로 
                //한번에 모든 것을 처리
                // oModel.createEntry("/SalesOrderSet", {
                //     properties : oCreateData
                // });

                //실제 생성에 반영이 된다.
                // oModel.submitChanges(
                //     {success: mySuccessHandler, 
                //      error: myErrorHandler})

            },
            onDelete:function(oEvent){
                //내가 삭제버튼을 누른 엔티티의 상세주소를 추출해서 삭제요청
                var sPath = oEvent.getParameter("listItem").getBindingContextPath();
                var oModel = this.getView().getModel();

                //delete http 요청
                oModel.remove(sPath, { success: function(){
                    MessageToast.show("삭제 되었습니다.")
                }})

            },
            onPressEdit: function(){
                this.byId("table").setMode("SingleSelectMaster");
            },
            onPressDel : function(){
                this.byId("table").setMode("Delete")
            },
            onPressItem: function(oEvent){
                var sPath = oEvent.getParameter("listItem").getBindingContextPath();
                var oModel = this.getView().getModel();
                var oData = oModel.getProperty(sPath);

                var oViewModel = this.getView().getModel("view");
                oViewModel.setProperty("/salesOrderNum", oData.Sonum);
                oViewModel.setProperty("/salesOrderMemo", oData.Memo);
                
            },
            onUpdate : function(){
                var oViewModel = this.getView().getModel("view");
                var oModel = this.getView().getModel();
                var sSONUM = oViewModel.getProperty("/salesOrderNum");
                var sMemo = oViewModel.getProperty("/salesOrderMemo");
                
                var sPath = "/SalesOrderSet('" + sSONUM + "')" ;

                var oData = {
                    Sonum : sSONUM, 
                    Memo : sMemo,
                }
                // PUT update 요청
                oModel.update(sPath, oData, { success : function(){
                    MessageToast.show("변경되었습니다.")
                }})
            },
            onRefresh : function(){
                this.getView().getModel().refresh(true);
            }
        });
    });
