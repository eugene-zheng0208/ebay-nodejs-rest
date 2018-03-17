//<!--
//1@@m1

ebay.oUtils.bustFrame=function()
{if(top.location!=self.location)
top.location.replace(ebay.oDocument.doc.location.href);}
ebay.oUtils.bustFrame();

//2@@m2

function EbayBizObject(pName)
{if(!this.objType)
this.objType="EbayBizObject";this.name=pName;this.createError=ebObjectCreateErrorWrapper;this.throwDebug=ebObjectThrowDebugWrapper;this.throwWarning=ebObjectThrowWarningWrapper;this.throwError=ebObjectThrowErrorWrapper;}

//3@@m6

function EbayServer()
{if(!this.objType)
this.objType="EbayServer";this.base=EbayBizObject;this.base("biz_server");this.aRequests=new Array;this.lastRequest=null;this.bReqInprogress=false;this.createRequest=ebServerCreateRequest;this.requestAll=ebServerRequestAll;this.getResponse=ebServerGetResponse;this.oXmlHTTP=null;this.oDataReciever=null;}
if(typeof(ebay)!="undefined")
ebay.oServer=new EbayServer();function ebServerCreateRequest(pName,pUrl,pIsGet)
{this.aRequests[pName]=new EbayServerRequest(pName,this,pUrl,pIsGet);this.lastRequest=this.aRequests[pName];return this.aRequests[pName];}
function ebServerRequestAll()
{}
function ebServerGetResponse(pReqName,pUseCache)
{}
function EbayServerRequest(pName,pParent,pUrl,pIsGet)
{if(!this.objType)
this.objType="EbayServerRequest";this.base=EbayBizObject;this.base(pName);this.parent=pParent;this.sUrl=pUrl;this.sMethod=(pIsGet)?"GET":"POST";this.sPostData="";this.bAsync=true;this.aDataListeners=new Array;this.oResponse=null;this.oResponseXml=null;this.bResponseReady=false;this.iResponseType=0;this.send=ebServerRequestSend;this.registerAsDataListener=ebServerRequestRegisterAsDataListener;this.requestProcess=ebServerRequestProcess;this.RESPONSE_JS=0;this.RESPONSE_HTML=1;this.RESPONSE_TEXT=2;this.RESPONSE_JSON=3;}
function ebServerRequestRegisterAsDataListener(pObj)
{this.aDataListeners[this.aDataListeners.length]=pObj;}
var g_oXmlHttp;function ebServerRequestSend()
{this.parent.bReqInprogress=true;if(typeof(window.XMLHttpRequest)!="undefined")
{g_oXmlHttp=new XMLHttpRequest();}
else if(typeof(ActiveXObject)!="undefined")
{var lib="Microsoft.XMLHTTP";g_oXmlHttp=new ActiveXObject(lib);}
else
{this.throwError("XML HTTP not supported","createRequest");return;}
g_oXmlHttp.open(this.sMethod,this.sUrl,this.bAsync);if(this.sMethod=='POST')
g_oXmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");var req=this;g_oXmlHttp.onreadystatechange=function()
{req.requestProcess(g_oXmlHttp);}
g_oXmlHttp.send(this.sPostData);}
function ebServerRequestProcess(pHTTP)
{if(pHTTP.readyState==4)
{var st=pHTTP.status;if(st==200)
{this.bResponseReady=true;this.oResponseXml=pHTTP.responseXML;var oRe=this.oResponse=new EbayServerResponse(this.name,this);oRe.sResponseText=""+pHTTP.responseText;oRe.sHeaderText=""+pHTTP.getAllResponseHeaders();oRe.process();oRe.notifyAll();}
else
{var msg="Error: "+pHTTP.statusText;if(st==404)
msg="Invalid URL: '"+this.sUrl+"' [System Error: "+pHTTP.statusText+"]";this.error=msg;this.throwError(msg,"requestProcess");}
pHTTP=null;this.parent.oXmlHTTP=null;this.parent.bReqInprogress=false;}}
function EbayServerResponse(pName,pParent)
{if(!this.objType)
this.objType="EbayServerResponse";this.base=EbayBizObject;this.base(pName);this.parent=pParent;this.sResponseText="";this.sHeaderText="";this.oData=null;this.oJSON=null
this.process=ebServerResponseProcess;this.notifyAll=ebServerResponseNotifyAll;}
function ebServerResponseProcess()
{var s=this.sResponseText,p=this.parent;if(s.length>0)
{if(s.hasAny("<html","<body","<script","<?xml "))
p.iResponseType=p.RESPONSE_HTML;if(p.iResponseType==p.RESPONSE_JS)
{eval(s);this.oData=ebay.oServer.oDataReciever;}
if(p.iResponseType==p.RESPONSE_JSON)
{try
{this.oJSON=eval('('+s+')');}
catch(e)
{}}
p.bResponseReady=true;}
else
this.throwWarning("Empty response","process")}
function ebServerResponseNotifyAll()
{var oLrs=this.parent.aDataListeners,len=oLrs.length;for(var i=0;i<len;i++)
{if(oLrs[i].processDataResponse)
oLrs[i].processDataResponse(this);}}

//4@@m4

function EbayDataNode(pParent,pName)
{if(!this.objType)
this.objType="EbayDataNode";this.name=pName;this.parent=pParent||this;this.aAttribs=new Array;this.aChildNodes=new Array;this.addLeaves=ebDataNodeAddLeaves;this.addChild=ebDataNodeAddChild;this.addAttrib=ebDataNodeAddAttrib;this.getNode=ebDataNodeGetNode;this.getNodeByPath=ebDataNodeGetNodeByPath;this._adL=this.addLeaves;this._adC=this.addChild;this._adA=this.addAttrib;if(pParent!=null)
this.parent.addChild(this);}
window.__ENd=EbayDataNode;function ebDataNodeAddChild(pNode)
{if(pNode)
this.aChildNodes[this.aChildNodes.length]=pNode;}
function ebDataNodeAddAttrib(pKey,pValue)
{this.aAttribs[pKey]=pValue;}
function ebDataNodeAddLeaves()
{var args=arguments,s="",len=args.length;for(var i=0;i<len;i++)
{s+="this."+args[i][0]+" = decodeURIComponent(\""+encodeURIComponent(args[i][1])+"\");";}
if(s.length>0)
eval(s);}
function ebDataNodeGetNode(pName,pKey,pVal)
{if(this.name==pName&&this.aAttribs[pKey]==pVal)
return this;var cns=this.aChildNodes,len=cns.length;for(var i=0;i<len;i++)
{if(cns[i].name==pName&&cns[i].aAttribs[pKey]==pVal)
return cns[i];}
for(var i=0;i<len;i++)
{var tmp=cns[i].getNode(pName,pKey,pVal);if(tmp)
return tmp;}
return null;}
function ebDataNodeGetNodeByPath(pPath)
{var delim="/";var aA=pPath.split(delim);var cns=this.aChildNodes;var res,len=aA.length;for(var i=0;i<len;i++)
{res=null;var len2=cns.length;for(var ii=0;ii<len2;ii++)
{if(cns[ii].name==aA[i])
{res=cns[ii];cns=cns[ii].aChildNodes;break;}}}
return res;}

//5@@m1

ebay.oD=ebay.oDocument;ebay.oP=ebay.oDocument.oPage;

//6@@m24

function EbayHTMLFrame(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbayHTMLFrame";this.base=EbayHTML;this.base(pParent,pName,pName,false,pCfg);this.eFrameElem=null;this.getElem=ebHTMLFrameGetElem;this.bindHTML=ebHTMLFrameBindHTML;this.bindEvents=this.enable=function(){};this.setSource=ebHTMLFrameSetSource;this.cleanupMemoryBase=this.cleanupMemory;this.cleanupMemory=ebHTMLFrameCleanupMemory;this.resize=ebHTMLFrameResize;this.onBeforeResize=this.onAfterResize=null;}
function ebHTMLFrameGetElem(pName)
{with(this)
{var f=null,oD=oDocument;var d=oD.doc,w=oD.win;if(w.frames)
f=eFrameElem=w.frames[pName];if(d.getElementById)
f=d.getElementById(pName);return f;}}
function ebHTMLFrameBindHTML()
{with(this)
{eElem=getElem(sElemName);if(eElem)
assignJSObject(eElem);}}
function ebHTMLFrameCleanupMemory()
{this.cleanupMemoryBase();this.eFrameElem=null;}
function ebHTMLFrameSetSource(pURL)
{if(pURL==null||pURL.trim()==''){return;}
with(this)
{oDocument.setGlobalParent(this);if(pURL.has("ej2child=true"))
pURL+="&ej2parent="+name;if(eFrameElem&&eFrameElem.location)
eFrameElem.location.replace(pURL);else if(eElem)
eElem.src=pURL;}}
function ebHTMLFrameResize(pMaxWidth)
{with(this)
{if(onBeforeResize)
onBeforeResize();var f=eFrameElem;if(!f||!(f.document||f.contentDocument))
f=getElem(sElemName);if(f&&typeof(f.document)!="unknown")
{var oDoc=f.document?f.document:f.contentDocument,db=oDoc.body,es=eElem.style,c=this.parent.oGlobals.oClient,w="100%",h=db.offsetHeight,oh;if(c.bSafari)
{oh=db.offsetHeight;w=oDoc.width;h=ebay.oDocument.doc.doctype!=null?oDoc.height+15:oDoc.height+1;}
else if(c.bFirefox)
{w=oDoc.width;h=oDoc.height}
else if(c.bWin||c.bOpera)
{w=db.scrollWidth;h=c.bNav&&ebay.oDocument.doc.doctype!=null?db.scrollHeight+30:db.scrollHeight;}
if(pMaxWidth&&c.bFirefox)
w="100%";if(this.oConfig)
{w=this.oConfig.iWidth||w;h=this.oConfig.iHeight||h;}
es.width=(w=="100%")?w:w+"px";es.height=h+"px";if(onAfterResize)
onAfterResize();}}}

//7@@m11

function EbayHTMLAnchor(pParent,pName,pDisabled,pCfg)
{if(!this.objType)
this.objType="EbayHTMLAnchor";this.base=EbayHTML;this.base(pParent,pName,pName,pDisabled,pCfg);this.getElem=ebHTMLAnchorGetElem;this.enableBase=this.enable;this.enable=ebHTMLAnchorEnable;this.subscribeEvents("onclick");}
function ebHTMLAnchorGetElem(pName)
{var d=this.oDocument.doc,l=null,len=null;l=d.links[pName];if(l)return l;if(d.getElementById)
l=d.getElementById(pName);if(l)return l;if(d.all)
l=d.all[pName];if(l)return l;if(d.layers)
{var lyrs=d.layers;len=lyrs.length;for(var i=0;i<len;i++)
{l=this.getElem(lyrs[i].document,pName);if(l)
return l;}}
len=d.links.length;for(var j=0;j<len;j++)
{l=d.links[j];if(typeof(l.name)=="undefined")
{if(l.onclick)
{var oc=l.onclick.toString();if(oc.indexOf("{#"+pName+"#}")!=-1)
return l;}}
else
{if(l.name==pName)
return l;}
l=null;}
return l;}
function ebHTMLAnchorEnable(pEnable)
{var cur=(pEnable)?"hand":"default";var el=this.eElem;if(el&&el.style)
{el.style.cursor=cur;el.style.color=pEnable?"":"gray";}
this.enableBase(pEnable);}
function setEbayLink(pS)
{return true;}

//8@@m6

function EbayHTMLLayer(pParent,pName,pDisabled,pCfg)
{if(!this.objType)
this.objType="EbayHTMLLayer";this.base=EbayHTML;this.base(pParent,pName,pName,pDisabled,pCfg);this.aBindEvents=new Array;this.getElem=ebHTMLLayerGetElem;this.getValue=ebHTMLLayerGetValue;this.setValue=ebHTMLLayerSetValue;}
function ebHTMLLayerGetElem(pName)
{var s=pName,d=this.oDocument.doc;if(d.getElementById)
return d.getElementById(s);else if(d.all)
return d.all(s);this.throwWarning("Not supported","getElem");}
function ebHTMLLayerGetValue(pIsText)
{if(this.eElem)
{if(pIsText)
{if(this.oDocument.oGlobals.oClient.bFirefox)
return this.eElem.textContent;else
return this.eElem.innerText;}
else
return this.eElem.innerHTML;}
else
return"";}
function ebHTMLLayerSetValue(pVal,pIsText)
{if(this.eElem)
{if(pIsText)
{if(this.oDocument.oGlobals.oClient.bFirefox)
this.eElem.textContent=pVal;else
this.eElem.innerText=pVal;}
else
this.eElem.innerHTML=pVal;}}

//9@@m11

function EbayHTMLText(pParent,pName,pDisabled,pCfg,bHidden)
{if(!this.objType)
this.objType="EbayHTMLText";this.base=EbayHTMLFormElem;this.base(pParent,pName,pDisabled,pCfg);this.value=ebHTMLTextValue;this.getValue=ebHTMLTextGetValue;this.setValue=ebHTMLTextSetValue;this.select=ebHTMLTextSelect;this.enableBase=this.enable;this.enable=ebHTMLTextEnable;if(bHidden!=true)
this.subscribeEvents("onchange","onblur","onfocus","onkeydown","onkeyup");}
function ebHTMLTextValue(pVal)
{var e=this.eElem;if(e)
{if(typeof(pVal)=="undefined")
return e.value;else
e.value=pVal;}}
function ebHTMLTextGetValue()
{return this.value();}
function ebHTMLTextSetValue(pVal)
{return this.value(pVal);}
function ebHTMLTextSelect()
{var e=this.eElem;if(e)
e.select();}
function ebHTMLTextEnable(pEnable)
{this.enableBase(pEnable);this.setStyle('backgroundColor',!pEnable?'#ccc':'#fff');}

//10@@m44

function EbayHelpAssistant(pParent,pName,pCfg,pBindOnInitialize)
{if(!this.objType)
this.objType="EbayHelpAssistant";this.base=EbayHTMLFrame;this.base(pParent,pCfg.sFrameName);this.oConfig=pCfg;this.bIsShowing=false;this.bOverflowSet=false;this.oMainLayer=new EbayHTMLLayer(this,pCfg.sMainLayerName);this.oHeaderLayer=new EbayHTMLLayer(this,pCfg.sHeaderLayerName);this.oHeaderCloseLink=new EbayHTMLAnchor(this,pCfg.sCloseLinkElemName);this.oSrchTxt=new EbayHTMLText(this,pCfg.sSearchTxtBox);this.oSrchBtn=new EbayHTMLButton(this,pCfg.sSearchBtn);this.oCSSErrorLayer=new EbayHTMLLayer(this,pCfg.sCSSErrorDiv);this.oStateText=new EbayHTMLText(this,pCfg.sHelpElemName);this.oCurrentElem=null;this.oLayer=new EbayHTMLLayer(this,pCfg.sFrameName+"_div");this.oLiveHlpLayer=null;if(pCfg.sLiveHelpHeaderLayerName)
this.oLiveHlpLayer=new EbayHTMLLayer(this,pCfg.sLiveHelpHeaderLayerName);with(this)
{var bIE6=oGlobals.oClient.bIE&&oGlobals.oClient.iVer==6;if(!oConfig.bDisableWinResize&&!bIE6)
_registerListener(oDocument._getEvent("resize"),EVENT_AFTER,"updateStyles");if(oConfig.bShowOnLoad)
_registerListener(oDocument._getEvent("load"),EVENT_AFTER,"onAfterLoad");}
this.init=function(pBind)
{with(this)
{if(pBind)
{var es=oConfig.aElemNames,len=es.length,e;for(var i=0;i<len;i++)
{e=new EbayHTML(this,es[i],es[i]);subscribeElemEvents(e,oConfig.aURL[es[i]]);}}
oHeaderCloseLink._registerEvent("onclick","onCloseHelp");oHeaderCloseLink.onCloseHelp=function()
{this.parent.setHelpStat(false);this.parent.hideFrame();return false;}}}
this.onAfterLoad=function()
{with(this)
{if(!bOverflowSet)
setOverflow();updateStyles();var cp=oUtils.controlPath(this);setTimeout(cp+".showFrame(null,"+cp+".oConfig.sDefaultURL)",500);}}
this.setOverflow=function()
{with(this)
{if(!oMainLayer.eElem)
oMainLayer.bind();var oCSS=oCSSErrorLayer;if(!oCSS.eElem)
oCSS.bind();if(!oCSS.eElem||oCSS.height()==0)
{var de=document.documentElement?document.documentElement:null,oBody=this.oDocument.doc.body,sST=0;if(de)
{if(de.scrollTop>0)
sST=de.scrollTop;de.scrollTop=0;de.style.overflow='hidden';}
else if(oBody.scrollTop>0)
sST=oBody.scrollTop;oBody.scrollTop=0;oBody.style.overflow="hidden";oMainLayer.setStyle("overflow","auto");oMainLayer.eElem.scrollTop=sST;}
bOverflowSet=true;}}
this.createHTMLObject=function(pElem)
{with(this)
{var n=pElem.name||pElem.id,e=new EbayHTML(this,n,n);subscribeElemEvents(e,oConfig.aURL[n]);e.bind();}}
this.subscribeElemEvents=function(pElem,pURL)
{var el=pElem.eElem,evt=(el&&el.type)?"onfocus":"onclick";pElem.elemFocus=this.elemFocus;pElem.subscribeEvents(evt);pElem._registerEvent(evt,"elemFocus");pElem.sURL=pURL;}
this.processAnchorClick=function(pAnchor)
{with(this)
{if(bIsShowing&&((pAnchor==oCurrentElem)||pAnchor.name.isAny(oConfig.aMainLinkNames)))
hideFrame();else
showFrame(pAnchor,pAnchor.eElem.href);}}
this.elemFocus=function()
{var p=this.parent,isAnchor=this.eElem.type?false:true;if(isAnchor)
p.processAnchorClick(this);else if(p.bIsShowing)
p.processElemFocus(this);return!isAnchor;}
this.processElemFocus=function(pAnchor)
{this.showFrame(pAnchor);}
this.updateStyles=function()
{with(this)
{var d=oDocument,w=d.win.innerWidth||d.doc.body.clientWidth;if(bIsShowing)
w-=width();if(w<50)
return;if(bIsShowing)
{var h=d.win.innerHeight||d.doc.body.clientHeight;height((h-oHeaderLayer.height()-100)+'px');oLayer.height((h-oHeaderLayer.height()-100)+'px');oLayer.left(w+'px');oHeaderLayer.left(w+'px');if(oLiveHlpLayer)
oLiveHlpLayer.left(w+'px');}
w-=30;oMainLayer.width(w+'px');if(((d.win.innerHeight||d.doc.body.clientHeight)-15)>0)
oMainLayer.height(((d.win.innerHeight||d.doc.body.clientHeight)-15)+'px');}}
this.showFrame=function(pAnchor,pURL)
{this.setHelpStat(true);with(this)
{if(!bOverflowSet)
setOverflow();if(!eElem)
bind();bIsShowing=true;oCurrentElem=pAnchor;setSource(pURL||pAnchor.sURL);show(true);if(!oHeaderLayer.eElem)
oHeaderLayer.bind();oHeaderLayer.show(true);if(oHeaderCloseLink)
oHeaderCloseLink.focus(true);if(oLiveHlpLayer)
{if(!oLiveHlpLayer.eElem)
oLiveHlpLayer.bind();oLiveHlpLayer.show(true);}
if(!oLayer.eElem)
oLayer.bind();oLayer.show(true);if(!oSrchTxt.eElem)
oSrchTxt.bind();oSrchTxt.show(true);oSrchTxt.focus(true);oSrchBtn.bind();oSrchBtn._registerEvent("onclick","searchOnclick");oSrchBtn.searchOnclick=function()
{setSource(this.parent.oConfig.sSearchUrl+encodeURIComponent(oSrchTxt.value()));return false;}
oSrchTxt.bind();oSrchTxt._registerEvent("onfocus","searchtext");oSrchTxt.searchtext=function()
{oSrchBtn.enable(oSrchTxt.value()!="");}
oSrchTxt._registerEvent("onkeyup","searchtextkeyup");oSrchTxt.searchtextkeyup=function()
{oSrchBtn.enable(oSrchTxt.value()!="");if((typeof(oConfig.bSearchEnabled))!="undefined")
{oDocument.getUIElem("myForm").onsubmit=function()
{oSrchBtn.searchOnclick();return false;}}}
updateStyles();var c=ebay.oDocument.getConfig("Selling.Common");if(c.bCommentsEnabled){ebay.oDocument.getUIElem("commentButton").style.right="-1px";}
oStateText.setValue("true");}}
this.hideFrame=function()
{var hidehelp=new EbayHTMLAnchor(this,pCfg.aMainLinkNames);hidehelp.bind();this.setHelpStat(false);with(this)
{bIsShowing=false;oCurrentElem=null;show();oHeaderLayer.show(false);oLayer.show(false);if(oLiveHlpLayer)
oLiveHlpLayer.show(false);updateStyles();var c=ebay.oDocument.getConfig("Selling.Common");if(c.bCommentsEnabled){ebay.oDocument.getUIElem("commentButton").style.right="16px";}
oStateText.setValue("false");}
hidehelp.focus(true);}
this.setHelpStat=function(bValue)
{try
{var hlpStat=this.parent.parent._getControl("helpStat");if(!hlpStat.eElem){hlpStat.bind();}
if(typeof(hlpStat)!="undefined")
hlpStat.setValue(bValue);}
catch(e){}}
this.init(pBindOnInitialize);}

//11@@m1

function EbaySYI3HelpPopup(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbaySYI3HelpPopup";var c={};c.iWidth=parseInt(pCfg.iWidth);c.iHeight=parseInt(pCfg.iHeight);c.iLeft=screen.availWidth-c.iWidth;c.iTop=0;c.bToolbar=false;c.bLocation=false;c.bStatus=false;c.bScrollbars=true;c.bResizable=false;c.bMenubar=false;this.base=EbayHTMLPopup;this.base(pParent,pName,c);}

//12@@m12

function EbaySYI3HelpAssistant(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbaySYI3HelpAssistant";this.base=EbayHelpAssistant;this.base(pParent,pName,pCfg);this.showFrameBase=this.showFrame;this.oPopup=new EbayHTMLPopup(this,"live_help_popup");this.sLastFocus;this.init=function()
{var c=this.oConfig,ac=c.aMainLinkNames;for(var i in ac)
{var e=new EbayHTMLAnchor(this,ac[i]);e.onclick=function()
{this.parent.setHelpStat(true);this.parent.processAnchorClick(this);return false;}}
if(c.sLiveHlpLnk)
{var lnk=new EbayHTMLAnchor(this,c.sLiveHlpLnk);lnk.onclick=function()
{this.parent.oPopup.showEx(this.eElem.href,c.sLiveHlpWidth,c.sLiveHlpHeight,false,false,false,false,false,false);}}}
this.showFrame=function(pAnchor,pURL)
{with(this)
{if((oCurrentElem==null)||((typeof(pAnchor.sURL)!="undefined")&&(oCurrentElem.sURL!=pAnchor.sURL))||((typeof(pURL)!="undefined")&&(oCurrentElem.sURL!=pURL)))
{showFrameBase(pAnchor,pURL);var ol=ebay.oDocument.oPage.oDisplayedOverlay;if(ol)
{ol.iLeftPadding=-(width()/2);ol.setPosition();}}}}
this.hideFrameBase=this.hideFrame;this.hideFrame=function()
{with(this)
{hideFrameBase();parent.sCurrentMoreHelp=parent.sMoreHelpPage=null;var ol=ebay.oDocument.oPage.oDisplayedOverlay;if(ol)
{ol.iLeftPadding=0;ol.setPosition();}
if(this.getElem(this.sLastFocus))
this.getElem(this.sLastFocus).focus();}}
this.display=function(pUrl,sFocus)
{with(this)
{var u=pUrl;if(parent.bForceHelpPane)
{if(bIsShowing)
setSource(u);else
showFrame(null,u);}
else if(bIsShowing)
setSource(u);this.sLastFocus=sFocus;}}
this.init();}

//13@@m47

function EbaySYI3HelpBubble(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbaySYI3HelpBubble";this.base=EbayHTMLOverlayContent;this.base(pParent,pCfg.sLayerHTMLName,pCfg);this.oConfig=pCfg;this.sDefaultOverlayHTML="";this.iEventX=this.iEventY=null;this.iLocX=this.iLocY=null;this.sTopRgtHTML=pCfg.sTopTableHTML+pCfg.sTopRgtBtmRow+pCfg.sBtmTableHTML;this.sTopLftHTML=pCfg.sTopTableHTML+pCfg.sTopLftBtmRow+pCfg.sBtmTableHTML;this.bLeftBubble=false;this.setDefaultHTML=function()
{with(this)
{var p=parent,haCtl=p.oHelpAssistant,x=iLocX>0?iLocX:iEventX,w=p.bIsOverlay?x+200:x+280,b=w>(document.body.clientWidth-((haCtl&&haCtl.bIsShowing)?haCtl.width():0));bLeftBubble=b?false:true;sDefaultOverlayHTML=!b?sTopLftHTML:sTopRgtHTML;if(p.bIsOverlay)
width(200+"px");setValue(sDefaultOverlayHTML);}}
this.positionOverlay=function(pLeft,pTop,pNoOffsetHeight)
{with(this)
{var l=pLeft?pLeft:parent.bIsOverlay?iEventX:iLocX,t=pTop?pTop:parent.bIsOverlay?iEventY:iLocY,c=oConfig,p=parent,cl,oh=pNoOffsetHeight?0:height(),hb="-5",wb="20",bTopBubble=(iEventY-oh)>0?true:false;if(bTopBubble)
{cl=!bLeftBubble?c.sTopRightClass:c.sTopLeftClass;sTop=t-oh;}
else
{cl=!bLeftBubble?c.sBottomRightClass:c.sBottomLeftClass;sTop=t-hb;}
setClass(cl);sLeft=l;sLeft-=!bLeftBubble?this.eElem.offsetWidth:0;sTop=!sTop.toString().has("px")?sTop+"px":sTop;sLeft=!sLeft.toString().has("px")?sLeft+"px":sLeft;setPosition();if(c.useIfShim)
{setIframeShim();var ifShimElem=eElem.getElementsByTagName("IFRAME")[0];if(ifShimElem)
{var st=ifShimElem.style;st.height=ifShimElem.offsetHeight-10;if(!bTopBubble)
st.top=10;else
st.top=1;ifShimElem.title=" ";}}}}
this.displayContent=function(pId,pText,pEvent)
{with(this)
{if(!eElem)
bind();if(!eElem)
return;var p=parent,c=oConfig,evts,e,oPos=oUtils.oPositioning,offLoc;var evt=oDocument.win.event||pEvent;var cCfg=ebay.oDocument.getConfig('Selling.Common');c.bOnFocus=cCfg.bOnFocus;c.sStartLyrName=cCfg.sStartLyrName;if(evt)
{iEventX=evt.clientX;iEventY=evt.clientY;if(evt.currentTarget&&iEventX==0&&iEventY==0){iEventX=evt.currentTarget.offsetLeft;iEventY=evt.currentTarget.offsetTop;}}
e=oDocument.getUIElem(pId);offLoc=oPos.getOffsetLeftTop(e);iLocX=offLoc[0];iLocY=offLoc[1];setDefaultHTML();if(!c.bDialog&&p.sMoreHelpPage)
{pText+='<p class="'+c.sBubFooterClass+'">'+c.sMoreHelpHTML+"</p>";}
sContent=pText?sDefaultOverlayHTML.replaceTokens(pText):null;this.bUseIfShim=false;var div1=document.createElement('div');div1.style.position="absolute";div1.style.width="300px";div1.style.height="300px";div1.style.top="0px";div1.style.left="0px";var div2=document.createElement('div');div2.style.position="absolute";div2.style.top="0px";div2.style.left="0px";div2.innerHTML=sContent;div1.appendChild(div2);document.body.appendChild(div1);var tH=div2.offsetHeight+20,tW=div2.offsetWidth;var l=parent.bIsOverlay?iEventX:iLocX,t=parent.bIsOverlay?iEventY:iLocY,c=oConfig,p=parent,cl,oh=tH,hb="-5",wb="20",bTopBubble=(iEventY-tH)>0?true:false;if(bTopBubble){cl=!bLeftBubble?c.sTopRightClass:c.sTopLeftClass;sTop=t-tH;}
else{cl=!bLeftBubble?c.sBottomRightClass:c.sBottomLeftClass;sTop=t-hb;}
sLeft=l;sLeft-=!bLeftBubble?tW:0;sTop=!sTop.toString().has("px")?sTop+"px":sTop;sLeft=!sLeft.toString().has("px")?sLeft+"px":sLeft;document.body.removeChild(div1);display();if(evt&&evt.currentTarget&&(evt.currentTarget.id=='facebookhelp'))
positionOverlay(l-180);else
positionOverlay();bindLinks();}}
this.bindLinks=function()
{with(this)
{var e,c=oConfig;e=new EbayHTMLAnchor(this,c.sCloseBubbleLink);e.subscribeEvents("onblur");e.onblur=function()
{if(this.parent.eElem.firstChild)
this.parent.eElem.firstChild.focus(true);}
e.onclick=function()
{p=this.parent;p.closeBubble();if(p.oSelectedElem)
p.oSelectedElem.focus(true);return false;;}
e=new EbayHTMLAnchor(this,c.sMoreHelpLink);e.onclick=function()
{var p=this.parent;if(p.oSelectedElem)
p.oSelectedElem.focus(true);var hs=p.parent,oHA=hs.oHelpAssistant,l=hs.sMoreHelpPage,oHP=hs.oHelpPopup
if(hs.sCurrentMoreHelp!=l)
{hs.sCurrentMoreHelp=l;if(l.has(":1"))
l=l.replaceTokensEx(":1","_"+p.oConfig.sMetaId);if(!l.has(".html"))
l=hs.oHAConfig.sHelpUrlPrefix+l+".html";if(hs.bHelpInPopup)
{hs.sCurrentMoreHelp=null;oHP.sUrl=l;oHP.show();}
else
{if(oHA.bIsShowing)
oHA.setSource(l);else
{if(c.bPopup)
{oHA.oPopup.sUrl=l;oHA.oPopup.bResizable=true;hs.sCurrentMoreHelp=null;oHA.oPopup.show();}
else
oHA.showFrame(null,l);}}}
p.closeBubble();return false;}
for(var i in controls)
controls[i].bind();}}
this.closeBubble=function()
{for(var i in this.controls)
this.controls[i].cleanupMemory();this.hide();}}

//14@@m4

function EbaySYI3LearnMorePopup(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbaySYI3LearnMorePopup";this.base=EbayBaseControl;this.base(pParent,pName);var c=pCfg;if(c.aLearnMores)
{var aL=c.aLearnMores,len=aL.length;for(var i=0;i<len;i++)
{var lnks=aL[i],lnk,aDims=[],oA;if(lnks.has(':'))
{var a=lnks.split(':');lnk=a[0];aDims=typeof a[1]=='string'?eval(a[1]):a[1];}
else
lnk=lnks;oA=new EbayHTMLAnchor(this,lnk,false,c);oA.aDims=aDims;oA.onclick=function()
{var c=this.oConfig,oPop=this.parent.controls['help_popup'];oPop.sUrl=this.eElem.href;if(this.aDims.length>0)
{oPop.iWidth=this.aDims[0];oPop.iHeight=this.aDims[1];oPop.iLeft=screen.availWidth-this.aDims[0];}
else
{oPop.iWidth=c.iWidth;oPop.iHeight=c.iHeight;oPop.iLeft=screen.availWidth-c.iWidth;}
oPop.show();return false;}}
new EbaySYI3HelpPopup(this,'help_popup',c);}}

//15@@m8

function EbayUtilsPositioning(pParent,pName)
{if(!this.objType)
this.objType="EbayUtilsPositioning";this.base=EbayObject;this.base(pParent,pName);this.getScrollLeftTop=function()
{var d=this.oDocument.doc,rv=[0,0],db=d.body,de=d.documentElement;if(db)
{rv[0]+=db.scrollLeft;rv[1]+=db.scrollTop;}
if(de)
{rv[0]+=de.scrollLeft;rv[1]+=de.scrollTop;}
return rv;}
this.getClientWidthHeight=function()
{var d=this.oDocument.doc,de=d.documentElement?d.documentElement:d.body;return[de.clientWidth,de.clientHeight];}
this.getOffsetLeftTop=function(pElem)
{var e=pElem,rv=[0,0];while(e)
{rv[0]+=e.offsetLeft;rv[1]+=e.offsetTop;e=e.offsetParent;}
return rv;}
this.getEventLeftTop=function(pEvent)
{var evt=this.parent.parent.oDocument.win.event||pEvent,xOff=(typeof(screenLeft)!="undefined")?screenLeft:screenX,yOff=(typeof(screenTop)!="undefined")?screenTop:(screenY+(outerHeight-innerHeight)-25);return[evt.screenX-xOff,evt.screenY-yOff];}
this.getPageSize=function()
{var x,y,oD=this.parent.parent.oDocument,win=oD.win,doc=oD.doc,bd=doc.body;if(win.innerHeight&&win.scrollMaxY)
{x=bd.scrollWidth;y=win.innerHeight+win.scrollMaxY;}
else if(doc.documentElement)
{x=doc.documentElement.scrollWidth;y=doc.documentElement.scrollHeight;}
else if(bd.scrollHeight>bd.offsetHeight)
{x=bd.scrollWidth;y=bd.scrollHeight;}
else
{x=bd.offsetWidth;y=bd.offsetHeight;}
return[x,y];}}
ebay.oUtils.oPositioning=new EbayUtilsPositioning(ebay.oUtils,"Positioning Functions");

//16@@m27

function EbayHTMLOverlay(pParent,pName,pCfg,pDisabled)
{if(!this.objType)
this.objType="EbayHTMLOverlay";this.base=EbayHTMLLayer;this.base(pParent,pName,pDisabled,pCfg);this.isSupported=ebIsBrowserSupported;if(!this.isSupported())
return;this.sPosStyle=pCfg.posStyle||'absolute';this.sTop=pCfg.top;this.iTopPadding=0;this.iLeftPadding=0;this.sLeft=pCfg.left;this.sWidth=pCfg.width?parseInt(pCfg.width):0;this.sHeight=pCfg.height?parseInt(pCfg.height):0;this.sLayerHTML=pCfg.layerHTML||"";this.sContentDiv=pCfg.contentDiv||"";this.bForceReposition=pCfg.bForceReposition||false;this.bNoSetContent=pCfg.bNoSetContent;this.bClearValueOnClose=typeof(pCfg.bClearValueOnClose)!='undefined'?pCfg.bClearValueOnClose:true;this.bCustomHTML=pCfg.customHTML||false;this.bTransparent=pCfg.transparent||false;this.setPosition=ebHTMLOverlaySetPosition;this.centerTop=ebHTMLOverlayCenterTop;this.centerLeft=ebHTMLOverlayCenterLeft;this.setContent=ebHTMLOverlaySetContent;this.closeOverlay=this.close=ebHTMLOverlayCloseOverlay;this.display=ebHTMLOverlayDisplay;}
function ebHTMLOverlayDisplay(pContent)
{with(this)
{if(!eElem)
bind();if(!bNoSetContent)
setContent(pContent);setPosition();show(true);if(this.oConfig.bOnFocus&&(!(oGlobals.oClient.bIE&&oGlobals.oClient.iVer<7)))
{var sFirstInsElem="sFirstInsElem";var oFirstEle=this.eElem.firstChild;if(oFirstEle.id!=sFirstInsElem)
{var anchorTag=document.createElement('a');anchorTag.href="javascript:void(0);";anchorTag.id=sFirstInsElem;anchorTag.style.outline="0px solid #FFFFFF";anchorTag.style.position="absolute";anchorTag.style.left="-10000em";anchorTag.style.opacity=0;anchorTag.style.width="1px";anchorTag.style.height="1px";var sLyrName=this.oConfig.sStartLyrName;if(sLyrName)
anchorTag.innerHTML="<b class='g-hdn'>"+sLyrName+"</b>";try{this.eElem.setAttribute('role','dialog');anchorTag.setAttribute('aria-ignore','true');}catch(e){}
this.eElem.insertBefore(anchorTag,oFirstEle);anchorTag.focus();}
else
oFirstEle.focus(true);}}}
function ebHTMLOverlaySetPosition()
{with(this)
{if(sPosStyle.is('absolute'))
{if(!sTop||bForceReposition)
centerTop();if(!sLeft||bForceReposition)
centerLeft();top(sTop);left(sLeft);}}}
function ebHTMLOverlayCenterTop()
{with(this)
{var oD=oDocument,winHeight=oD.doc.body.clientHeight,cL=oGlobals.oClient;if(!cL.bIE)
winHeight=oD.win.innerHeight;else if(typeof(winHeight)=='undefined'&&cL.iVer>=6)
winHeight=oD.doc.documentElement.clientHeight;var s=(winHeight-sHeight)/2;if(document.documentElement)
s+=document.documentElement.scrollTop;sTop=(parseInt(s)+iTopPadding)+'px';return s;}}
function ebHTMLOverlayCenterLeft()
{with(this)
{var winWidth=document.body.clientWidth,cL=oGlobals.oClient;if(!cL.bIE)
winWidth=window.innerWidth;var s=winWidth/2-sWidth/2;sLeft=(parseInt(s)+iLeftPadding)+'px';return s;}}
function ebHTMLOverlaySetContent(pContent)
{with(this)
{if(sContentDiv!='')
{var oL=new EbayHTMLLayer(this,sContentDiv);oL.bind();oL.setValue(pContent);}
else
setValue(pContent);}}
function ebHTMLOverlayCloseOverlay()
{with(this)
{if(bClearValueOnClose)
{var cts=this.controls;if(sContentDiv!=''&&cts[sContentDiv])
{cts[sContentDiv].setValue('&nbsp;');}
else
{setValue('&nbsp;');if(this.oConfig.bOnFocus&&this.oSelectedElem)
{ele=this.controls[this.oSelectedElem.name];if(ele)
ele.focus(true);}}}
show();if(!this.oGlobals.oClient.bFirefox)
cleanupMemory();}}
function ebIsBrowserSupported()
{return true;}

//17@@m11

function EbayHTMLOverlayContent(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbayHTMLOverlayContent";this.base=EbayHTMLOverlay;this.base(pParent,pName,pCfg);if(!this.isSupported())
return null;this.bUseIfShim=pCfg.useIfShim||false;this.sContent=pCfg.contentHTML;this.sLayerUI=pCfg.layerHTML;this.iBorderWidth=pCfg.iBorderWidth||0;this.hide=this.closeOverlay;this.setIframeShim=ebHTMLOverlayContentSetIframeShim;this.displayBase=this.display;this.display=ebHTMLOverlayContentDisplay;this.closeBase=this.close;this.closeOverlay=this.close=ebHTMLOverlayContentClose;var cl=this.oGlobals.oClient;this.bUseIfShim=(pCfg.useIfShim&&(cl.bIE&&!cl.bMac));this.eIframeShim=null;this.setContentBase=this.setContent;this.setContent=ebHTMLOverlayContentSetContent;}
function ebHTMLOverlayContentDisplay(pContent)
{with(this)
{displayBase(sContent||pContent);if(bUseIfShim)
setIframeShim();}}
function ebHTMLOverlayContentSetIframeShim()
{with(this)
{if(eElem)
{var d=oDocument,isRel=sPosStyle=='relative',e=isRel?e.firstChild:eElem;var w=width(),h=height(),f=eIframeShim=d.createElement('IFRAME'),bw=iBorderWidth;with(f.style)
{position='absolute';top=isRel?'20px':(0-bw)+'px';left=isRel?'20px':(0-bw)+'px';zIndex='-1';width=(w+bw)+'px';height=(h+bw)+'px';}
f.frameBorder='0';f.title=' ';f.src=oGlobals.oEnvironment.sPicsDir+'s.gif';e.appendChild(f);}}}
function ebHTMLOverlayContentSetContent(pContent)
{this.sContent=pContent;this.setContentBase(pContent);}
function ebHTMLOverlayContentClose()
{with(this)
{if(bUseIfShim&&eIframeShim&&eElem)
eElem.removeChild(eIframeShim);closeBase();}}

//18@@m52

function EbaySYIHelpSystem(pParent,pName,pOverlay)
{if(!this.objType)
this.objType="EbaySYIHelpSystem";this.base=EbayBaseControl;this.base(pParent,pName);this.aElemsData=[];this.iBUBBLE_HELP=1;this.iHELP_ASSISTANT=2;this.sMoreHelpPage=this.sCustomizeForm=this.sCurrentMoreHelp=null;this.oReq=null;this.bIsOverlay=pOverlay?pOverlay:false;this.bForceHelpPane=false;this.bWaitForAjaxCall=false;this.bHelpInPopup=false;this.sHelpUrlPrefix=null;this.oHelpAssistant=this.oBubbleHelp=this.oHelpPopup=this.oBubbleConfig=this.oHAConfig=null;this.bShowCustomizeForm=true;with(this)
{_registerListener(oDocument._getEvent("unload"),EVENT_AFTER,"onBeforeUnload");_registerListener(oDocument._getEvent("load"),EVENT_AFTER,"onAfterLoad");}
this.init=function()
{var ed=pParent.parent,haCfg=ed.getConfig("Selling.HelpAssistant");var bhCfg=ed.getConfig("Selling.BubbleHelp"),ac=ed.aConfigs,en=[],n,a;this.oBubbleConfig=bhCfg;this.oHAConfig=haCfg;this.sHelpUrlPrefix=haCfg.sHelpUrlPrefix;if(bhCfg)
{if(typeof(bhCfg.bHelpInPopup)!='undefined')
this.bHelpInPopup=bhCfg.bHelpInPopup;if(typeof(bhCfg.bShowCustomizeForm)!="undefined")
this.bShowCustomizeForm=bhCfg.bShowCustomizeForm;if(!this.bIsOverlay)
{if(!this.bHelpInPopup)
this.oHelpAssistant=new EbaySYI3HelpAssistant(this,"help assistant",haCfg);else
this.oHelpPopup=new EbaySYI3HelpPopup(this,'help_popup',bhCfg);}
this.oBubbleHelp=new EbaySYI3HelpBubble(this,"bubble help",bhCfg);}}
this.getHTMLElem=ebHTMLGetElem;this.onAfterLoad=function()
{if(!this.oBubbleHelp)
return;if(this.oBubbleHelp.oConfig.sBlock=="SellHub")
this.setSellHubBubble();else
{var cp=this.oUtils.controlPath(this);setTimeout(cp+".getHelpData()",1000);}}
this.onBeforeUnload=function()
{var an=this.aElemsData;for(var i in an)
{an[i]=null;var e=document.getElementById(i);if(e)
{e.onclick=null;e.onfocus=null;}}
this.aElemsData=null;var ctl=this.controls;for(var i in ctl)
{ctl[i].eElem=null;ctl[i]=null;}
if(ebay.oServer)
{var aR=ebay.oServer.aRequests;for(var i in aR)
aR[i]=null;ebay.oServer.lastRequest=null;g_oXmlHttp=null;}}
this.getHelpData=function()
{var c=this.oBubbleHelp.oConfig,oHead=document.getElementsByTagName("head")[0],oScript=this.oDocument.createElement("script");this.parent.oHelpDataListner=this;oScript.setAttribute("type","text/javascript");oScript.setAttribute("src",c.sBubbleHelpJSUrl);oScript.setAttribute("id","bh_tag");oHead.appendChild(oScript);}
this.processDataResponse=function()
{with(this)
{var p=parent,aBD=p.aBubbleData,oD,bc=this.oBubbleHelp.oConfig,block=bc.sBlock;if(!block)
block=bc.sPage;oD=aBD[block];for(var i in oD)
{var d=oD[i];aElemsData[i]={"bt":d["bt"],"hp":d["hp"],"cf":d["cf"],"gh":d["gh"]};createHelpLinks(i);}
p.aBubbleData=[];p.oHelpDataListner=null;}}
this.createHelpLinks=function(pId)
{var e=this.oDocument.getUIElem(pId);if(e)
{var ed=this.aElemsData[pId];if(ed)
{var bt=ed["bt"],hp=ed["hp"],gh=ed["gh"];if(bt)
{e.onclick=this.loadHelpBubble;if(!this.bIsOverlay&&!this.bHelpInPopup)
this.createHelpAssistant(pId,hp);}
else if(gh&&!this.bIsOverlay)
this.createGetHelpLink(pId,gh);else if(hp&&!this.bIsOverlay&&!this.bHelpInPopup)
this.createHelpAssistantLinks(e);}}}
this.createHelpAssistant=function(pId,pHP)
{var e=pId.substr(0,pId.indexOf('_'));var eElem=this.oDocument.getUIElem(e);if(eElem)
{this.aElemsData[e]={"bt":"","hp":pHP,"cf":""};if(pHP!="")
this.createHelpAssistantLinks(eElem);}}
this.createHelpAssistantLinks=function(pElem)
{var e=pElem,et=e.type;if(e.id!="addfescatlink"&&(e.tagName.toUpperCase()=="A"||e.tagName.toUpperCase()=='DIV'||et=="hidden"))
return;var type=et?'focus':'click';if(e.addEventListener)
e.addEventListener(type,this.loadHelpAssistant,false);else if(e.attachEvent)
e.attachEvent('on'+type,this.loadHelpAssistant);}
this.createGetHelpLink=function(pId,pGH)
{var e=this.oDocument.getUIElem(pId);if(e)
{this.aElemsData[pId]={"bt":"","hp":pGH,"cf":""};e.onclick=function()
{var hs=ebay.oDocument.oPage.controls["help system"];hs.bForceHelpPane=true;hs.loadHelpAssistant(this.id);hs.bForceHelpPane=false;return false;}}}
this.setSellHubBubble=function()
{var i,sBT,len=this.oBubbleHelp.oConfig.sElemIdBubbleText.length;for(i=0;i<len;i++)
{sBT=this.oBubbleHelp.oConfig.sElemIdBubbleText[i];var a=[];if(sBT)
{a=sBT.split(':');var id=a[0],bt=a[1];this.aElemsData[id]={"bt":bt,"hp":null,"cf":null};var e=this.oDocument.getUIElem(id);if(e)
e.onclick=this.loadHelpBubble;}}}
this.loadHelpBubble=function(pEvent)
{var id=this.id,p=ebay.oDocument.oPage,hs=p._getControl("help system");if(typeof(hs.aElemsData[id])!="undefined")
{with(hs)
{var e=aElemsData[id],elem=oDocument.getUIElem(id);sMoreHelpPage=e["hp"]?e["hp"]:(typeof e["hp"]=="undefined"||e["hp"]=="")?elem.href.has("http://")&&!elem.href.has("http://cgi")&!elem.href.has("http://ext-syi")?elem.href:null:null;sCustomizeForm=bShowCustomizeForm?(e["cf"]?e["cf"]:null):null;oBubbleHelp.oSelectedElem=this;if(e["bt"])
oBubbleHelp.displayContent(id,e["bt"],pEvent);}}
return false;}
this.loadHelpAssistant=function(pId)
{var id=this.id?this.id:typeof pId=="object"&&pId.srcElement?pId.srcElement.id:pId,hs=ebay.oDocument.oPage._getControl("help system"),oHP=hs.oHelpPopup;if(typeof(hs.aElemsData[id])!="undefined")
{with(hs)
{var p=aElemsData[id]["hp"],oHA=oHelpAssistant;if(p==sMoreHelpPage)
return false;sMoreHelpPage=p;if(p.has(":1"))
p=p.replaceTokensEx(":1","_"+oBubbleHelp.oConfig.sMetaId);var l=sHelpUrlPrefix+p+".html";if(hs.bHelpInPopup)
{sMoreHelpPage=null;oHP.sUrl=l;oHP.show();}
else
oHA.display(l,pId);}}
return false;}
this.init();}

//19@@m6

function EbayHTMLButton(pParent,pElemName,pDisabled,pCfg)
{if(!this.objType)
this.objType="EbayHTMLButton";this.base=EbayHTMLFormElem;this.base(pParent,pElemName,pDisabled,pCfg);this.getValue=ebHTMLButtonGetValue;this.setValue=ebHTMLButtonSetValue;this.enableBase=this.enable
this.enable=ebHTMLButtonEnable;this.subscribeEvents("onclick");}
function ebHTMLButtonGetValue()
{return this.eElem.value;}
function ebHTMLButtonSetValue(pValue)
{var e=this.eElem;if(e)
e.value=pValue;}
function ebHTMLButtonEnable(pEnable,pYukonize)
{if(typeof(pYukonize)!=='undefined'&&pYukonize)
{var e=this.eElem;e.style.opacity=!pEnable?".5":"";e.style.filter=!pEnable?"alpha(opacity=50)":"";this.bBtnDisabled=!pEnable;}
else
this.enableBase(pEnable);}

//20@@m16

function EbayHTMLBaseCheckboxRadio(pParent,pName,pDisabled,pCfg)
{if(!this.objType)
this.objType="EbayHTMLBaseCheckboxRadio";this.base=EbayHTMLFormElem;this.base(pParent,pName,pDisabled,pCfg);this.bGroup=false;this.bindHTML=ebHTMLBaseCheckboxRadioBindHTML;this.bindEvents=ebHTMLBaseCheckboxRadioBindEvents;this.check=ebHTMLBaseCheckboxRadioCheck;this.selectByIndex=ebHTMLBaseCheckboxRadioSelectByIndex;this.selectByValue=ebHTMLBaseCheckboxRadioSelectByValue;this.isCheckedByValue=ebHTMLBaseCheckboxRadioIsCheckedByValue;this.getValueByIndex=ebHTMLBaseCheckboxRadioGetValueByIndex;this.getIndexByValue=ebHTMLBaseCheckboxRadioGetIndexByValue;this.getValue=null;this.enableBase=this.enable;this.enable=ebHTMLBaseCheckboxRadioEnable;this.setValue=this.selectByValue;this.onBeforeCheck=null;this.onAfterCheck=null;this.subscribeEvents("onclick");}
function ebHTMLBaseCheckboxRadioBindHTML()
{with(this)
{eElem=getElem(sElemName);if(eElem)
{if(eElem.length)
{bGroup=true;var len=eElem.length;for(var i=0;i<len;i++)
assignJSObject(eElem[i]);cleanupMemory=ebHTMLBaseCheckboxRadioCleanupMemory;}
else
{bGroup=false;assignJSObject(eElem);}}
if(bDisabled)
enable(false);}}
function ebHTMLBaseCheckboxRadioCleanupMemory()
{var e=this.eElem;if(e)
{var len=e.length;for(var j=0;j<len;j++)
{for(var i in e[j].jsObjs)
{e[j].jsObjs[i]=null;}
e[j].jsObjs=null;}
this.eElem=null;}}
function ebHTMLBaseCheckboxRadioBindEvents()
{with(this)
{if(!eElem)
return;var e=aBindEvents,len=e.length,fStr;for(var i in e)
{var len2=eElem.length;if(len2&&len2>0)
{for(var ii=0;ii<len2;ii++)
eval("eElem[ii]."+e[i]+" = function(){"+this.bindEventString(e[i],ii)+"}");}
else
{eval("eElem."+e[i]+" = new Function(this.bindEventString(e[i],0))");}}}}
function ebHTMLBaseCheckboxRadioCheck(pChecked,pIndex)
{if(pIndex<0)
return;with(this)
{if(eElem)
{if(bGroup&&typeof(pIndex)=='undefined')
{var len=eElem.length;for(var i=0;i<len;i++)
eElem[i].checked=pChecked;}
else if(bGroup&&eElem[pIndex])
eElem[pIndex].checked=pChecked;else if(!bGroup)
eElem.checked=pChecked;}}}
function ebHTMLBaseCheckboxRadioSelectByIndex(pIdx,pCheck)
{var chx=typeof pCheck!='undefined'?pCheck:true;with(this)
{if(onBeforeCheck)
onBeforeCheck();var e=bGroup?eElem[pIdx]:eElem;if(e)
{e.checked=chx;if(onAfterCheck)
onAfterCheck();}}}
function ebHTMLBaseCheckboxRadioSelectByValue(pVal,pCheck)
{var chx=typeof pCheck!='undefined'?pCheck:true;with(this)
{if(onBeforeCheck)
onBeforeCheck();var e=eElem;if(!e)
return;if(bGroup)
{var len=e.length;for(var i=0;i<len;i++)
{if(e[i].value==pVal)
{e[i].checked=chx;if(onAfterCheck)
onAfterCheck();}}}
else
{if(e.value==pVal)
{e.checked=chx;if(onAfterCheck)
onAfterCheck();}}}}
function ebHTMLBaseCheckboxRadioIsCheckedByValue(pValue)
{with(this)
{var e=eElem;if(e&&bGroup)
{var len=e.length;for(var i=0;i<len;i++)
{if(e[i].value==pValue)
return isChecked(i);}}}}
function ebHTMLBaseCheckboxRadioGetValueByIndex(pIndex)
{with(this)
{var e=eElem;if(e&&bGroup)
return e[pIndex].value;return null;}}
function ebHTMLBaseCheckboxRadioGetIndexByValue(pValue)
{with(this)
{var e=eElem;if(e&&bGroup)
{var len=e.length;for(var i=0;i<len;i++)
{if(e[i].value==pValue)
return i;}}
return-1;}}
function ebHTMLBaseCheckboxRadioEnable(pEnable)
{with(this)
{enableBase(pEnable);if(bGroup)
{var v=pEnable?"true":"false",e=eElem,len=e.length;if(e)
{for(var i=0;i<len;i++)
{e[i].onfocus=new Function("return "+v+";");e[i].disabled=!pEnable;}}}}}

//21@@m8

function EbayHTMLCheckbox(pParent,pName,pDisabled,pCfg)
{if(!this.objType)
this.objType="EbayHTMLCheckbox";this.base=EbayHTMLBaseCheckboxRadio;this.base(pParent,pName,pDisabled,pCfg);this.getElem=ebHTMLCheckboxGetElem;this.isChecked=ebHTMLCheckboxIsChecked;this.getValue=ebHTMLCheckboxGetValue;this.setValue=this.selectByValue;}
function ebHTMLCheckboxGetElem(pName)
{return this.oDocument.getFormElem(pName,"checkbox");}
function ebHTMLCheckboxIsChecked(pIndex)
{with(this)
{if(eElem)
{if(bGroup&&eElem[pIndex])
return eElem[pIndex].checked;else if(!bGroup)
return eElem.checked;}}
return false;}
function ebHTMLCheckboxGetValue(pUnCheckedValue)
{var e=this.eElem,rv="";if(this.bGroup)
{rv=[];var len=e.length;for(var i=0;i<len;i++)
{if(e[i].checked)
rv[rv.length]=e[i].value;}
if(!rv.length)rv="";}
else
{if(pUnCheckedValue)
return e.value;if(e.checked)
return e.value;}
return rv;}

//22@@m7

function EbayHTMLForm(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbayHTMLForm";this.base=EbayHTML;this.base(pParent,pName,pName,false,pCfg);this.getElem=function(){return this.getDocElem(arguments[0],'forms');};this.enable=function(){};this.getElementValue=ebHTMLFormGetElementValue;this.setElementValue=ebHTMLFormSetElementValue;this.getElements=ebHTMLFormGetElements;this.getElement=ebHTMLFormGetElement;this.setAction=ebHTMLFormSetAction;this.getAction=ebHTMLFormGetAction;this.setTarget=ebHTMLFormSetTarget;this.getTarget=ebHTMLFormGetTarget;this.submit=ebHTMLFormSubmit;this.clear=ebHTMLFormClear;this.subscribeEvents("onsubmit");this.onBeforeSubmit=null;this.onAfterSubmit=null;}
function ebHTMLFormGetElements()
{var e=this.eElem;return e?e.elements:new Array;}
function ebHTMLFormGetElement(pName)
{var elems=this.getElements();return elems[pName]?elems[pName]:null;}
function ebHTMLFormGetElementValue(pName)
{var elems=this.getElements();if(elems[pName]&&elems[pName].value)
return elems[pName].value;return"";}
function ebHTMLFormSetElementValue(pName,pValue)
{var elems=this.getElements(),elem=elems[pName];if(elem)
{if(elem.length)
{for(var i=0,len=elem.length;i<len;i++)
elem[i].value=pValue;}
else
elem.value=pValue;}}
function ebHTMLFormSetAction(pAction)
{var e=this.eElem;if(e)
e.action=pAction;}
function ebHTMLFormGetAction()
{var e=this.eElem;if(e)
return e.action;}
function ebHTMLFormSetTarget(pTarget)
{var e=this.eElem;if(e)
e.target=pTarget;}
function ebHTMLFormGetTarget()
{var e=this.eElem;if(e)
return e.target;}
function ebHTMLFormSubmit()
{if(this.onBeforeSubmit)
this.onBeforeSubmit();var e=this.eElem;if(e)
{e.submit();if(this.onAfterSubmit)
this.onAfterSubmit();}
else
this.throwError("Element '"+this.sElemName+"' does not exist on the page","submit");}
function ebHTMLFormClear()
{var elems=this.getElements(),len=elems.length;for(i=0;i<len;i++)
{var elem=elems[i];var type=elem.type;switch(type)
{case"text":case"textarea":elem.value="";break;case"checkbox":elem.checked=false;break;case"select-one":elem.selectedIndex=0;}}}

//23@@m8

function EbayHTMLRadio(pParent,pName,pDisabled,pCfg)
{if(!this.objType)
this.objType="EbayHTMLRadio";this.base=EbayHTMLBaseCheckboxRadio;this.base(pParent,pName,pDisabled,pCfg);this.getElem=ebHTMLRadioGetElem;this.getValue=ebHTMLRadioGetValue;this.getSelectedIndex=ebHTMLRadioGetSelectedIndex;}
function ebHTMLRadioGetElem(pName)
{return this.oDocument.getFormElem(pName,"radio");}
function ebHTMLRadioGetValue()
{var e=this.eElem;if(!e){return"";}
if(this.bGroup)
{var len=e.length;for(var i=0;i<len;i++)
{if(e[i].checked)
return e[i].value;}}
else
{if(e.checked)
return e.value;}
return"";}
function ebHTMLRadioGetSelectedIndex()
{var e=this.eElem;if(!this.bGroup)
return 0;else
{var len=e.length;for(var i=0;i<len;i++)
{if(e[i].checked)
return i;}}
return-1;}

//24@@m24

function EbayHTMLSelect(pParent,pName,pDisabled,pCfg)
{if(!this.objType)
this.objType="EbayHTMLSelect";this.base=EbayHTMLFormElem;this.base(pParent,pName,pDisabled,pCfg);this.iSelIndex=-1;this.createOption=ebHTMLSelectCreateOption;this.clearOptions=ebHTMLSelectClearOptions;this.getValueByIndex=ebHTMLSelectGetValueByIndex;this.getSelectedIndex=ebHTMLSelectGetSelectedIndex;this.getSelectedValue=ebHTMLSelectGetSelectedValue;this.getSelectedText=ebHTMLSelectGetSelectedText;this.getOptionsLength=ebHTMLSelectGetOptionsLength;this.setOption=ebHTMLSelectSetOption;this.insertOption=ebHTMLSelectInsertOption;this.deleteOption=ebHTMLSelectDeleteOption;this.selectByIndex=ebHTMLSelectSelectByIndex;this.selectByValue=ebHTMLSelectSelectByValue;this.selectByText=ebHTMLSelectSelectByText;this.doSelect=ebHTMLSelectDoSelect;this.getIndexByValue=ebHTMLSelectGetIndexByValue;this.getValue=this.getSelectedValue;this.setValue=this.selectByValue;this.subscribeEvents("onchange");}
function ebHTMLSelectClearOptions()
{var e=this.eElem;if(e)
{var opts=e.options;while(opts.length>0)
opts[opts.length-1]=null;}}
function ebHTMLSelectCreateOption(pName,pText,pClass,pDisabled)
{if(this.eElem)
{var nOpt=new Option(pText,pName,false,false),opts,lo,oC=ebay.oGlobals.oClient;if(typeof(pClass)!="undefined")
nOpt.className=pClass;if(typeof(pDisabled)!="undefined")
nOpt.disabled=pDisabled;opts=this.eElem.options;opts[opts.length]=nOpt;idx=opts.length-1;return idx;}}
function ebHTMLSelectGetValueByIndex(pIdx,pTextOnly)
{if(pIdx>-1)
{opt=this.eElem.options[pIdx];if(opt)
return pTextOnly?opt.text:opt.value;}
this.throwError("Invalid index","get");return"";}
function ebHTMLSelectGetSelectedIndex()
{return this.eElem.selectedIndex;}
function ebHTMLSelectGetSelectedValue()
{return this.getValueByIndex(this.eElem.selectedIndex);}
function ebHTMLSelectGetSelectedText()
{return this.getValueByIndex(this.eElem.selectedIndex,true);}
function ebHTMLSelectGetOptionsLength()
{return this.eElem.options.length;}
function ebHTMLSelectSelectByIndex(pIndex)
{this.eElem.selectedIndex=this.iSelIndex=pIndex;}
function ebHTMLSelectDoSelect(pVal,pIsText)
{if(this.eElem)
{var e=this.eElem,o,rv=false,opts=e.options,len=opts.length;for(var i=0;i<len&&!rv;i++)
{o=opts[i];if(((pIsText||(o.value==""))&&(pVal==o.text))||(!pIsText&&(o.value==pVal)))
{e.selectedIndex=this.iSelIndex=i;rv=true;}}}
else
this.throwWarning("HTML element '"+this.name+"' not found","selectByValue");return rv;}
function ebHTMLSelectSelectByValue(pVal)
{return this.doSelect(pVal);}
function ebHTMLSelectSelectByText(pVal)
{return this.doSelect(pVal,true);}
function ebHTMLSelectSetOption(pVal,pText,pInd,pClass,pDisabled)
{if(this.eElem)
{if((pInd!=null)&&(pInd>-1))
{var o=this.eElem.options[pInd];o.value=pVal;o.text=pText;}
else
this.createOption(pVal,pText,pClass,pDisabled);}
else
this.throwWarning("HTML element '"+this.name+"' not found","selectByValue");}
function ebHTMLSelectInsertOption(pVal,pText,pInd)
{with(this)
{var e=eElem,opts=e.options,len=opts.length;var inOpt=new Array(pText,pVal),tmpOpt=new Array(2);var sel=getSelectedValue();len++;if(pInd>=len)
return;for(i=pInd;i<len;i++)
{if(i<len-1)
tmpOpt=[e.options[i].text,e.options[i].value];opts[i]=new Option(inOpt[0],inOpt[1]);inOpt=tmpOpt;}
selectByValue(sel);}}
function ebHTMLSelectDeleteOption(pInd)
{if(typeof(pInd)!='undefined')
{var opts=this.eElem.options;if(opts[pInd])
opts[pInd]=null;}}
function ebHTMLSelectGetIndexByValue(pVal,pIsText)
{var opts=this.eElem.options,len=opts.length,i=0;for(;i<len;i++)
{o=opts[i];if((o.value==pVal)||(pIsText&&(o.text==pVal)))
return i;}
return-1;}

//25@@m1

function EbayHTMLSelectMulti(pParent,pName,pDisabled,pCfg)
{if(!this.objType)
this.objType="EbayHTMLSelectMulti";this.base=EbayHTMLSelect;this.base(pParent,pName,pDisabled,pCfg);this.getSelectedIndices=ebHTMLSelectMultiGetSelectedIndices;this.getSelectedValues=ebHTMLSelectMutliGetSelectedValues;this.getSelectedValuesAndText=ebHTMLSelectMultiGetSelectedValuesAndText;this.getAllValuesAndText=ebHTMLSelectMultiGetAllValuesAndText;this.clearSelections=ebHTMLSelectMultiClearSelections;}
function ebHTMLSelectMultiGetSelectedIndices(pVals,pValsAndText,pAll)
{var e=this.eElem,rv=[];if(e)
{var opts=e.options,len=opts.length,o,v;for(var i=0;i<len;i++)
{o=opts[i];if(o.selected||pAll)
{v=i;if(pValsAndText)
v=[o.value,o.text];else if(pVals)
v=o.value;rv[rv.length]=v;}}}
return rv;}
function ebHTMLSelectMutliGetSelectedValues()
{return this.getSelectedIndices(true);}
function ebHTMLSelectMultiGetSelectedValuesAndText()
{return this.getSelectedIndices(false,true);}
function ebHTMLSelectMultiGetAllValuesAndText()
{return this.getSelectedIndices(false,true,true);}
function ebHTMLSelectMultiClearSelections()
{var e=this.eElem;if(e)
{var opts=e.options,len=opts.length;for(var i=0;i<len;i++)
opts[i].selected=false;}}

//26@@m8

function EbaySYI3Grayout(pParent,pName)
{if(!this.objType)
this.objType="EbaySYI3Grayout";this.base=EbayBaseControl;this.base(pParent,pName);this.oLayer=new EbayHTMLLayer(this,'lyrGrayout_sec');this.aSelElems=this.oDocument.doc.getElementsByTagName('SELECT');this.aExcludeSelElems=[];this.bDisableSelElems=true;this.display=function(pWidth,pHeight,pPosArray)
{var oL=this.oLayer,pos=pPosArray;if(!oL.eElem)
oL.bind();oL.width(pWidth+'px');oL.height(pHeight+'px');oL.show(true);oL.left((pos?pos[0]:0)+'px');oL.top((pos?pos[1]:0)+'px');oL.setValue("");if(this.bDisableSelElems)
this.disableSelElems(true);}
this.hide=function()
{var oL=this.oLayer;oL.show(false);if(this.bDisableSelElems)
this.disableSelElems(false);}
this.disableSelElems=function(pDisable)
{if(pDisable)
this.aExcludeSelElems=[];var aS=this.aSelElems,l=aS.length;for(var i=0;i<l;i++)
{if(pDisable&&aS[i].disabled)
this.aExcludeSelElems[this.aExcludeSelElems.length]=aS[i].name;if(!pDisable&&this.oUtils.isInArray(this.aExcludeSelElems,aS[i].name))
continue;aS[i].disabled=pDisable;}}}

//27@@m4

function EbayUtilsArray(pParent,pName)
{if(!this.objType)
this.objType="EbayUtilsArray";this.base=EbayObject;this.base(pParent,pName);this.copyArray=function(pSrcArr)
{var ra=[];for(var i in pSrcArr)
ra[i]=pSrcArr[i];return ra;}
this.getArrayIndex=function(pSrcArr,pValue)
{var ri=-1,a=pSrcArr,l=a.length;for(i=0;i<l;i++)
{if(a[i]==pValue)
{ri=i;break;}}
return ri;}
this.removeFromArray=function(pSrcArr,pIndex,pValue)
{var ra=[];for(var i in pSrcArr)
{if(pValue!=null)
{if(pSrcArr[i]!=pValue)
ra[i]=pSrcArr[i];}
else if(i!=pIndex)
ra[i]=pSrcArr[i];}
return ra;}
this.insertIntoArray=function(pSrcArr,pIndex,pValue)
{var ra=pSrcArr.splice(pIndex,0,pValue);return ra;}
this.shift=function(pSrcArr,pIndex)
{if(!pIndex)
return pSrcArr.shift()
else
{var i=0,len=pSrcArr.length,ra=[];for(i;i<len;i++)
{if(i!=pIndex)
ra[ra.length]=pSrcArr[i];}
return ra;}}}
ebay.oUtils.oArray=new EbayUtilsArray(ebay.oUtils,"Array Functions");

//28@@m1

function EbayFontSizeDetector(pParent,pName)
{if(!this.objType)
this.objType="EbayFontSizeDetector";this.base=EbayObject;this.base(pParent,pName);this.oDetector=null;this.sFontSizeDetector='fontSizeDetector';this.iFontSize=0;this.init=function()
{with(this)
{oDetector=new EbayHTMLLayer(this,sFontSizeDetector);var oD=oDocument,oCtl=oD.createElement('SPAN');oCtl.id=sFontSizeDetector;oCtl.style.position='absolute';var oBody=oD.doc.getElementsByTagName('BODY')[0];oBody.insertBefore(oCtl,oBody.firstChild);}}
this.getSize=function()
{with(this)
{if(!oDetector.eElem)
oDetector.bind();oDetector.left(-999);oDetector.setValue('&nbsp;');return oDetector.height();}}
this.init();}
ebay.oUtils.oFontSizeDetector=new EbayFontSizeDetector(ebay.oUtils,'FontSizeDetector');

//29@@m2

function EbayXmlHelper(pParent,pName)
{if(!this.objType)
this.objType="EbayXmlHelper";this.getValue=function(pXml,pXPath)
{var aX=pXPath.split('/');var nd=this.getNodeByXpath(pXml,pXPath),rv;rv=nd?this.getNodeValue(nd):'';return rv;}
this.getNode=function(pXml,pName,pIndex)
{var nodes=pXml.getElementsByTagName(pName);if(nodes)
{if(pIndex>=0)
{if(nodes.length>=pIndex)
return nodes[pIndex];}
else
{if(nodes[0])
return nodes[0];}}
return null;}
this.getNodes=function(pXml,pName)
{return pXml.getElementsByTagName(pName);}
this.getNodeByXpath=function(pXml,pXPath)
{var aX=pXPath.split('/');var nd=null,idx,nm='',len=aX.length;for(var i=0;i<len;i++)
{idx=0;nm=aX[i];if(nm.indexOf(']')==nm.length-1)
{idx=nm.substr(nm.indexOf('[')+1,nm.indexOf(']')-nm.indexOf('[')-1);nm=nm.substr(0,nm.indexOf('['));}
nd=this.getNode((nd==null)?pXml:nd,nm,parseInt(idx));if(nd==null)
break;}
return nd;}
this.getNodeValue=function(pNode)
{var rv,pn=pNode;if(pn.childNodes.length>1)
rv=pn.childNodes[1].nodeValue;else
rv=pn.firstChild?pn.firstChild.nodeValue:null;return rv;}
this.getAttribValue=function(pXml,pXPath,pId)
{var nd=this.getNodeByXpath(pXml,pXPath);if(nd)
{var aA=nd.attributes,len=aA.length;for(var i=0;i<len;i++)
{if(aA[i].name==pId)
return aA[i].value;}}
return"";}}
ebay.oUtils.oXmlHelper=new EbayXmlHelper(ebay.oUtils,'XmlHelper');

//30@@m4

function EbayDOMMouse(pParent,pName)
{if(!this.objType)
this.objType="EbayDOMMouse";this.base=EbayBaseControl;this.base(pParent,pName);this.iMouseX=this.iMouseY=-1;this.bMonitorDrag=false;this.oDOMEvent=null;with(this)
_registerListener(oDocument._getEvent("unload"),EVENT_BEFORE,"onBeforeDocumentUnload");this.onmousemove=function(pEvent)
{try
{ebay.oDocument.oMouse.setMouseData(pEvent);}
catch(e){}
ebay.oDocument.oMouse.aftermousemove(pEvent);}
this.onmousedown=function(pEvent)
{ebay.oDocument.oMouse.setMouseData(pEvent);jsObj._exec("mousedown");}
this.onmouseup=function(pEvent)
{var od=ebay.oDocument.oMouse;od.setMouseData(pEvent);od.bMonitorDrag=false;jsObj._exec("mouseup");}
this.registerEvents=function()
{with(this.parent)
{registerDocEvent("mousedown","","doc",typeof(doc.onmousedown),"oMouse");registerDocEvent("mouseup","","doc",typeof(doc.onmouseup),"oMouse");doc.onmousemove=this.onmousemove;}}
this.setMouseData=function(pEvent)
{var evt=pEvent||event;this.iMouseX=evt.clientX;this.iMouseY=evt.clientY;this.oDOMEvent=evt;}
this.onBeforeDocumentUnload=function()
{var d=this.oDocument.doc;d.onmousedown=d.onmouseup=onmousemove=null;}
this.aftermousemove=function(){}}
ebay.oDocument.oMouse=new EbayDOMMouse(ebay.oDocument,"Mouse Events");ebay.oDocument.oMouse.registerEvents();

//31@@m14

function EbayHTMLOverlayUrl(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbayHTMLOverlayUrl";this.base=EbayHTMLOverlay;this.base(pParent,pName,pCfg);if(!this.isSupported())
return null;this.sUrl=pCfg.url||null;this.sIframeName='if_'+pName;this.sIframeTitle=pCfg.sIframeTitle||null;this.sLayerUI=pCfg.layerHTML;this.bAutoResize=pCfg.autoResize;this.bCloseLink=pCfg.defCloseLink;this.bDowngradeDomain=true;this.bTransparent=pCfg.bTransparent;this.displayBase=this.display;this.display=ebHTMLOverlayUrlDisplay;this.hide=this.closeOverlay;this.closeOverlayBase=this.closeOverlay;this.closeOverlay=ebHTMLOverlayUrlCloseOverlay;this.closeLayerUI=ebHTMLOverlayUrlCloseLayer;this.setCloseLayer=ebHTMLOverlayUrlSetCloseLayer;this.getIFUrl=ebHTMLOverlayUrlGetIFUrl;this.setDowngrade=ebHTMLOverlayUrlSetDowngradeDomain;this.onAfterFrameLoad=ebHTMLOverlayUrlAfterFrameLoad;}
function ebHTMLOverlayUrlDisplay()
{with(this)
{if(!sUrl)
return;var s=getIFUrl();if(oGlobals.oEnvironment.sThisPageRaw==sUrl)
return;if(bCloseLink)
s+=setCloseLayer();displayBase(s);new EbayHTMLFrame(this,sIframeName);}}
function ebHTMLOverlayUrlSetCloseLayer()
{with(this)
{sLayerHTML=closeLayerUI()+sLayerUI;var a=new EbayHTMLAnchor(this,'close');a._registerEvent("onclick","this.parent.hide();return false;");}}
function ebHTMLOverlayUrlCloseLayer()
{var s='';var stl='border-collapse:collapse; border-width:2px 2px 0px 2px; background-color:#EEEEEE;border-style:outset;';with(this)
{var pd=oGlobals.oEnvironment.sPicsDir,img=pd+'icon/iconClose_20x20.gif',w=parseInt(sWidth)+4;s+='<table id="tblClose" width="'+w+'" cellspacing="0" cellpadding="4"';s+='style="'+stl+'">';s+='<tr><td align="right"><a href="#" name="close"><img src="'+img+'" border="0"></a>';s+='</td></tr></table>';}
return s;}
function ebHTMLOverlayUrlGetIFUrl()
{var s='';with(this)
{sUrl=setDowngrade(sUrl);if(sUrl.has("ej2child=true"))
{sUrl+="&ej2parent="+this.name;oDocument.setGlobalParent(this);}
s+='<iframe frameborder="no" border="0" marginwidth="0" marginheight="0"';s+=oConfig.bScrolling?' scrolling="auto"':' scrolling="no"';s+=' id="'+sIframeName+'" title="'+sIframeTitle+'" name="'+sIframeName+'"';s+=' src="'+sUrl+'"';s+=' width="'+sWidth+'" height="'+sHeight+'"';if(oConfig.sIframeClass)
s+=' class="'+oConfig.sIframeClass+'"';if(bTransparent)
s+=' allowtransparency="true"';s+='></iframe>';}
return s;}
function ebHTMLOverlayUrlSetDowngradeDomain(pUrl)
{if(!pUrl.has('downgradeDomain=true')&&this.bDowngradeDomain==true)
{pUrl+=!pUrl.has('?')?'?':'&';pUrl+='downgradeDomain=true';}
return pUrl;}
function ebHTMLOverlayUrlAfterFrameLoad()
{with(this)
{var ifObj=controls[sIframeName];if(!ifObj.eElem)ifObj.bind();if(bAutoResize)
ifObj.resize();if(bCloseLink)
{var e=oDocument.doc.getElementById('tblClose');ifObj.width(parseInt(e.style.width)+4);}}}
function ebHTMLOverlayUrlCloseOverlay()
{with(this)
{var ifObj=controls[sIframeName],cl=oGlobals.oClient;ifObj.bind();if(!cl.bFirefox)
ifObj.setSource(oGlobals.oEnvironment.sPicsDir+'tbx/s.gif');ifObj.cleanupMemory();setTimeout(oUtils.controlPath(this)+'.closeOverlayBase()',100);}}

//32@@m2

function EbayHTMLOverlayUrlDraggableToolbar(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbayHTMLOverlayUrlDraggableToolbar";this.base=EbayHTMLOverlayUrl;this.base(pParent,pName,pCfg);this.iLeft=this.iRight=this.iTop=this.iBottom=this.iLastLeft=this.iLastTop=this.iBaseLeft=this.iBaseTop=-1;this.iToolbarHeight=pCfg.iToolbarHeight||25;this.iInitialTimeout=250;this.iMoveTimeout=50;this.onAfterFrameLoadBase=this.onAfterFrameLoad;this.onAfterFrameLoad=ebHTMLOverlayUrlDraggableToolbarOnAfterFrameLoad;this.setDragCoordinates=ebHTMLOverlayUrlDraggableToolbarSetDragCoordinates;this.onAfterDocumentMouseDown=ebHTMLOverlayUrlDraggableToolbarOnAfterDocumentMouseDown;this.onAfterDocumentMouseUp=ebHTMLOverlayUrlDraggableToolbarOnAfterDocumentMouseUp;this.monitorMouseDrag=ebHTMLOverlayUrlDraggableToolbarMonitorMouseDrag;}
function ebHTMLOverlayUrlDraggableToolbarOnAfterFrameLoad(pDocument)
{this.onAfterFrameLoadBase();var ifr=this.controls[this.sIframeName],mDoc=this.oMouseDocument=pDocument;mDoc.onselectstart=function(pEvent)
{return false;}
this._registerListener(mDoc._getEvent("mousedown"),this.EVENT_AFTER,"onAfterDocumentMouseDown");this._registerListener(mDoc._getEvent("mouseup"),this.EVENT_AFTER,"onAfterDocumentMouseUp");}
function ebHTMLOverlayUrlDraggableToolbarSetDragCoordinates()
{with(this)
{var c=oConfig;iTop=c.iTop||0;iLeft=c.iLeft||0;iRight=iLeft+(c.iWidth||width());iBottom=iTop+(c.iHeight||iToolbarHeight);}}
function ebHTMLOverlayUrlDraggableToolbarOnAfterDocumentMouseDown()
{with(this)
{var od=oMouseDocument.oMouse,x=od.iMouseX,y=od.iMouseY;setDragCoordinates();if((x>=iLeft)&&(x<=iRight)&&(y>=iTop)&&(y<=iBottom))
{od.bMonitorDrag=true;iBaseLeft=x;iBaseTop=y;setTimeout(oUtils.controlPath(this)+".monitorMouseDrag(true)",iInitialTimeout);}}
return false;}
function ebHTMLOverlayUrlDraggableToolbarOnAfterDocumentMouseUp()
{this.oMouseDocument.oMouse.bMonitorDrag=false;return true;}
function ebHTMLOverlayUrlDraggableToolbarMonitorMouseDrag(pSetStyle)
{with(this)
{var od=oMouseDocument.oMouse;if(od.bMonitorDrag)
{if(pSetStyle)
setStyle("position","absolute");var buff=15,l=od.iMouseX-buff,t=od.iMouseY-buff;if((l!=iLastLeft)||(t!=iLastTop))
{left(left()+l-iBaseLeft);top(top()+t-iBaseTop);iLastLeft=l;iLastTop=t;}
setTimeout(oUtils.controlPath(this)+".monitorMouseDrag()",iMoveTimeout);}}}

//33@@m6

function EbaySOJTagging(pParent,pName,pConfig)
{var t=this;if(!t.objType)
t.objType="EbaySOJTagging";var c=t.oConfig=pConfig;t.base=EbayBaseControl;t.base(pParent,pName);t.sTagUrl=c.sTagUrl;t.bTagAllFields=c.bTagAllFields;t.aForms=[];t.iEventPostCount=c.iEventPostCount||5;t.iElemsTagged=0;t.iRDFld=null;t.aElemsTagged={};with(t)
{_registerListener(oDocument._getEvent("load"),EVENT_AFTER,"onAfterLoad");_registerListener(oDocument._getEvent("unload"),EVENT_AFTER,"taggingUnload");}
t.init=function()
{if(t.bTagAllFields)
{var c=t.oConfig;var oF=t.parent.controls[c.sFormName];if(!oF)
oF=new EbayHTMLForm(t.parent,c.sFormName);t.aForms[t.aForms.length]=oF;}}
t.taggingUnload=function()
{t.post(true);}
t.onAfterLoad=function()
{if(t.bTagAllFields)
t.registerFormFields();else if(typeof aSOJTagFields!='undefined')
t.registerFields(aSOJTagFields);}
t.registerFields=function(pFields)
{var af=pFields,l=af.length;for(var i=0;i<l;i++)
t.registerField(t.oDocument.getUIElem(af[i]));}
t.registerFormFields=function()
{var af=t.aForms,l=af.length;for(var i=0;i<l;i++)
{oF=af[i];if(!oF.eElem)
oF.bind();var elems=oF.getElements(),len=elems.length;for(var j=0;j<len;j++)
t.registerField(elems[j]);}}
t.registerField=function(pField)
{if(!pField)
return;var e=pField,id=e.id,typ=e.type,src=e.nodeName,oP=ebay.oDocument.oPage,o=oP.controls[id],p='parent.controls["'+t.name+'"].';if(typ)
{switch(typ.toLowerCase())
{case"text":case"textarea":t.attachEvent(e,'focus','registerTimeIn');t.attachEvent(e,'blur','registerTimeOut');break;case"radio":case"checkbox":case"button":case"submit":t.attachEvent(e,'click','registerTag');break;case"select-one":t.attachEvent(e,'change','registerTag');break;default:if(src&&src.toLowerCase()=="a")
t.attachEvent(e,'click','registerTag');break;}}
else
{if(src&&src.toLowerCase()=="a")
t.attachEvent(e,'click','registerTag');}
if(e)
e.tagObj=t;}
t.attachEvent=function(pElem,pEvent,pMethod)
{var e=pElem;if(e.addEventListener)
{e.removeEventListener(pEvent,eval('this.'+pMethod),false);e.addEventListener(pEvent,eval('this.'+pMethod),false);}
else if(e.attachEvent)
{e.detachEvent('on'+pEvent,eval('this.'+pMethod));e.attachEvent('on'+pEvent,eval('this.'+pMethod));}}
t.getTimeStamp=function()
{return new Date().getTime();}
t.registerTimeIn=function(a)
{var se;if(typeof a.type!='undefined')
se=a.srcElement?a.srcElement:a.target;var t=se&&se.tagObj?se.tagObj:this.objType&&this.objType=="EbaySOJTagging"?this:null;if(t)
{var nv=t.getNV(se,a),k=nv.n;if(t.aElemsTagged[k])
{var rd=Math.floor(Math.random()*999);k+="^"+rd;t.iRDFld=rd;}
t.aElemsTagged[k]=nv.ts;}}
t.registerTimeOut=function(a)
{var se;if(typeof a.type!='undefined')
se=a.srcElement?a.srcElement:a.target;var t=se&&se.tagObj?se.tagObj:this.objType&&this.objType=="EbaySOJTagging"?this:null;if(t)
{var nv=t.getNV(se,a),v,k=nv.n;if(t.iRDFld)
{k+="^"+t.iRDFld;t.iRDFld=null;}
v=t.aElemsTagged[k];if(typeof v!='undefined'&&!isNaN(v))
{t.aElemsTagged[k]=v+"|"+nv.ts+"|";t.iElemsTagged++;t.post();}
else
t.aElemsTagged[k]="";}}
t.registerTag=function(a)
{var se,uptracking,IsUPTrack;uptracking=['addPicturesBtn','flashUploaderLink','freeImgLayer','clUploadLink','clUploadBtn','useStandardLink','useEPSlnkCopyFromWeb','useSelfHostedLink','useEPSlnkBasic','useStandardLink2','useEPSlnkBasic2','useEPSlnkCopyFromWeb2'];if(typeof a.type!='undefined')
se=a.srcElement?a.srcElement:a.target;var t=se&&se.tagObj?se.tagObj:this.objType&&this.objType=="EbaySOJTagging"?this:null;if(t)
{var nv=t.getNV(se,a),k=nv.n;if(t.aElemsTagged[k])
k+="^"+Math.floor(Math.random()*999);var sojLnkId=nv.ts?nv.ts+"||":"||"+nv.v;IsUPTrack=(uptracking.indexOf(this.id)>-1);if(IsUPTrack)
{t.postUP_Tracking(this.id,sojLnkId);}
else
{t.aElemsTagged[k]=sojLnkId;t.iElemsTagged++;}
t.post();}}
t.getNV=function(pObj,pData)
{var o=pObj,oD=pData,n=typeof oD.k!='undefined'?oD.k:o?(o.id||o.name):null,v=typeof oD.v!='undefined'?oD.v:null;ts=!v?new Date().getTime():null;return{"n":n,"v":v,"ts":ts};}
t.post=function(pFlushData)
{var b=typeof pFlushData!='undefined'&&pFlushData,uptracking,bUPTrack;uptracking=['addPicturesBtn','flashUploaderLink','freeImgLayer','clUploadLink','clUploadBtn','useStandardLink','useEPSlnkCopyFromWeb','useSelfHostedLink','useEPSlnkBasic','useStandardLink2','useEPSlnkBasic2','useEPSlnkCopyFromWeb2'];if(b||t.iElemsTagged>=t.iEventPostCount)
{var s="";for(var i in t.aElemsTagged)
{bUPTrack=(uptracking.indexOf(i)>-1);if(!bUPTrack){var j=i;if(s.length>0)
s+=",";if(i.indexOf('^')>0)
i=i.substr(0,i.indexOf('^'));if(t.aElemsTagged[j]&&t.aElemsTagged[j].length>0)
s+=i+"|"+t.aElemsTagged[j];}}
if(s.length>0)
{if(typeof pageName!='undefined')
s+=",pageId|||"+pageName;t.aElemsTagged={}
t.iElemsTagged=0;t.iRDFld=null;new Image().src=t.sTagUrl+'{tagData="'+s+'"}';}}}
t.postUP_Tracking=function(id,sojLnkId)
{var s="",c,bclUPTrack,upcltracking;upcltracking=['flashUploaderLink','clUploadLink','clUploadBtn'];if(s.length>0)
s+=",";if(id.indexOf('^')>0)
id=id.substr(0,id.indexOf('^'));if(sojLnkId)
s+=id+"|"+sojLnkId;if(s.length>0)
{if(typeof pageName!='undefined')
s+=",pageId|||"+pageName;BrowserVr=navigator.userAgent;if(typeof BrowserVr!='undefined')
s+=",PU_BrowserVr|||"+BrowserVr;c=ebay.oDocument.getConfig("Selling.SOJTagging");UpldFlw=c.sCommand;if(typeof UpldFlw!='undefined')
s+=",PU_UpldFlw|||"+UpldFlw;DraftID=c.draftId;if(typeof DraftID!='undefined')
s+=",PU_DraftID|||"+DraftID;isCatalog=c.isCatalog;isUpEntryPts=c.isUpEntryPts;if(typeof isCatalog!='undefined'&&isUpEntryPts)
s+=",PU_IsCatalog|||"+isCatalog;bclUPTrack=(upcltracking.indexOf(id)>-1);if(bclUPTrack)
{s+=",CU_AddPhoto|||"+bclUPTrack;}
t.iRDFld=null;new Image().src=t.sTagUrl+'{tagData="'+s+'"}';}}
t.init();}

//34@@m2

ebay.oP.initSOJTagging=function(pPostCount)
{var c=this.oDocument.getConfig("Selling.SOJTagging");if(document.getElementById('soj'))
document.getElementById('soj').src.replace(/\&amp;/g,'&');if(c)
{c.iEventPostCount=typeof pPostCount!='undefined'?pPostCount:1;new EbaySOJTagging(this,'soj_tagging',c);}}

//35@@m2

function EbayHTMLDynamicSelectionChain(pParent,pName,pConfig)
{if(!this.objType)
this.objType="EbayHTMLDynamicSelectionChain";this.base=EbayHTML;this.base(pParent,pName);this.oConfig=pConfig;this.oData=null;this.aMembers=[];this.addAsMember=ebHTMLDSCAddAsMember;this.bind=new Function("");}
function ebHTMLDSCAddAsMember(pControl,pEventName)
{var p=this;while(p.objType!="EbayHTMLDynamicSelectionChain")
p=p.parent;var c=this.aMembers[this.aMembers.length]=new EbayHTMLDynamicSelectionChainMember(p,pControl,pEventName.toLowerCase());if(typeof(this.nodeLevel)!="undefined")
c.nodeLevel=this.nodeLevel+1;pControl.parentSCM=c;return c;}
function EbayHTMLDynamicSelectionChainMember(pParent,pControl,pListenEvent)
{if(!this.objType)
this.objType="EbayHTMLDynamicSelectionChainMember";this.name=pControl.name;this.parent=pParent;this.oControl=pControl;this.aMembers=[];this.addAsMember=ebHTMLDSCAddAsMember;this.nodeLevel=0;this.notifySelection=ebHTMLDSCMemberNotifySelection;if(pListenEvent&&pListenEvent.length>0)
{if(this.oControl&&!this.oControl.eElem)
this.oControl.bind();this.oControl._registerEvent(pListenEvent,"ebHTMLDSCMemberEvent");}}
function ebHTMLDSCMemberNotifySelection(pFromServer)
{var aM=this.aMembers,len=aM.length;for(var i=0;i<len;i++)
{if(aM[i].oControl.selectionUpdate)
aM[i].oControl.selectionUpdate(this.oControl,aM[i].parent,pFromServer);}}
function ebHTMLDSCMemberNotifyClear()
{var aM=this.aMembers,len=aM.length;for(var i=0;i<len;i++)
{if(aM[i].oControl.clearUpdate)
aM[i].oControl.clearUpdate(this.oControl,aM[i].parent);}}
function ebHTMLDSCMemberEvent()
{var pSC=this.parentSCM;pSC.notifySelection(false);}

//36@@m4

function EbayCategorySelectorConfig(pName)
{if(!this.objType)
this.objType="EbayCategorySelectorConfig";this.base=EbayConfig;this.base(pName);this.aElemNames=[];this.sUrl="";this.sForkSign=" >";this.aRestoreList=new Array;}
function EbayCategorySelector(pParent,pName,pConfig)
{if(!this.objType)
this.objType="EbayCategorySelector";this.base=EbayHTML;this.base(pParent,pName);var c=this.oConfig=pConfig;this.selectionChain=null;this.dataListener=null;this.aResponses=new Array;this.onLastSelection=null;this.onLeafSelection=null;this.onAfterSelection=function(pC)
{var oLE=this.onLeafSelection;if(oLE)
oLE(pC);}
this.clearMembers=function(pM)
{if(this.selectionChain)
{var cM=pM.aMembers[0];while(cM)
{cM.oControl.clearOptions();cM.oControl.enable(false);cM=cM.aMembers[0];}}}
this.requestData=function(pUrl,pName)
{var reqN="req_"+pName;if(this.aResponses[reqN])
{this.selectionChain.oData=this.aResponses[reqN]
if(this.dataListener)
{this.dataListener.notifySelection(false);this.dataListener=null;}
return;}
var req=ebay.server.createRequest(reqN,pUrl,true);req.sPostData="";req.registerAsDataListener(this);req.send();}
this.processDataResponse=function(pResp)
{this.aResponses[pResp.name]=pResp.oData;this.selectionChain.oData=pResp.oData;var p=pResp.parent;if(this.dataListener&&p.iResponseType==p.RESPONSE_JS)
{this.dataListener.notifySelection(true);this.dataListener=null;}
else
this.throwError("Invalid response. Response is not a JS type. [Response: "+encodeURIComponent(pResp.sResponseText.substr(0,100))+"...]","processDataResponse");}
this.processOnLastSelection=function(pE)
{if(this.onLastSelection)
this.onLastSelection(pE.parent.parent);}
this.bindHTML=function()
{var sc=this.selectionChain=new EbayHTMLDynamicSelectionChain(this,this.name,new EbayConfig(this.name));var eLs=c.aElemNames,len=eLs.length;var prev=sc,prevC=null,ctrl,ctrlM;for(var i=0;i<len;i++)
{ctrl=new EbayHTMLSelect(this.parent,eLs[i]);ctrl.selectionUpdate=ebSYICategorySelectorSelectionUpdate;if(i==len-1)
{var e=ctrl._registerEvent("onchange","");this._registerListener(e,this.EVENT_AFTER,"processOnLastSelection");}
ctrlM=prev.addAsMember(ctrl,"onchange");ctrlM.onAfterSelection=this.onAfterSelection;prev=ctrlM;prevC=ctrl;ctrl.bind();}
var aR=this.oConfig.aRestoreList;if(aR&&aR.length>0)
{prev=sc.aMembers[0],i=0,cat="";while(prev)
{cat=aR[i++];prev.oControl.selectByValue(cat);prev.oControl._exec("onchange");prev=prev.aMembers[0];}}}}
function ebSYICategorySelectorSelectionUpdate(pParent,pRoot)
{var eL=pParent.eElem;var selVal=eL.options[eL.selectedIndex].value;if(selVal.length==0)
return;var sc=pRoot.parent;var scm=pParent.parentSCM;var oD=null;var isReq=(pRoot.oData==null);if(!isReq)
{oD=pRoot.oData.getNode("Category","id",selVal);isReq=(oD==null||(oD.aChildNodes.length==0&&oD.aAttribs["isLeaf"]!="true"))}
if(isReq)
{sc.dataListener=scm;sc.requestData(sc.oConfig.sUrl.replaceTokens(selVal),selVal);return;}
sc.onAfterSelection(scm);var oOD=oD.aChildNodes;this.clearOptions();sc.clearMembers(scm);this.enable(true);var len=oOD.length;for(var i=0;i<len;i++)
{this.createOption(oOD[i].aAttribs["id"],oOD[i].Name+((oOD[i].aAttribs["isLeaf"]!="true")?sc.oConfig.sForkSign:""));}}

//37@@m29

ebay.oP.initCategoryShared=function(pConfig)
{this.oCatConfig=pConfig;var oD=this.parent,c=pConfig;c.sContinueButton='aidZ1';c.sActionElemName='aid';var eBtn=this.oContinueButton=new EbayHTMLButton(this,c.sContinueButton);eBtn.bind();eBtn.enable(c.aRestoreList.length>0,true);eBtn._registerEvent("onclick","clicked");eBtn.bForceContinue=true;eBtn.clicked=function(pEvent)
{with(this)
{if(bBtnDisabled)
return false;if(parent.bCarAdCatSelected)
{bForceContinue=true;var cfg=parent.oCatConfig,aid=new EbayHTMLText(this,cfg.sActionElemName);aid.bind();aid.setValue(cfg.sCarAdAid);}
if(!bForceContinue)
{var p=parent,sce=p.oCatConfig.aSelectedCategoryElems,cts=p.controls,o=p.oOverlay;if(o&&c.bMskuPrompt&&!cts[sce[1]].getValue().is("")){this.eElem.form.elements["prevCat2"].value=cts[sce[1]].getValue();}
if(o&&cts[sce[1]].getValue().is(""))
{this.sFirstCatValue=cts[sce[0]].getValue();var sResponseType="JS";var url=o.oConfig.sUrl.replaceTokens(sFirstCatValue);var req=ebay.oServer.createRequest("Rec2ndCat",url,true);req.iResponseType=req.HTML_RESPONSE;req.registerAsDataListener(this);req.send();return false;}}
return true;}}
eBtn.processDataResponse=function(pResp)
{with(this)
{eval(pResp.sResponseText);if(bIsMultiSKUEnable||recCatCount)
{var p=parent,o=p.oOverlay,c=o.oConfig,url=c.sUrl.replaceTokens(sFirstCatValue),oGreyLyr=p.oGOL;var vSInd=url.indexOf("&vMode="),vLInd=url.indexOf("&",vSInd+1);o.sUrl=url.substring(0,vSInd)+url.substr(vLInd)+"&ej2child=true";o.bDowngradeDomain=false;try
{var sFontSize=oUtils.oFontSizeDetector.getSize();o.sHeight=sFontSize>16&&sFontSize<21?450:sFontSize>21?500:c.height;}
catch(e)
{}
var haCtl=p._getControl("hlpFrm");o.iLeftPadding=haCtl.bIsShowing?-(haCtl.width()/2):0;o.iTopPadding=haCtl.oMainLayer.eElem.scrollTop;if(oGlobals.oClient.bIE)
{var oD=this.oDocument,oContent=oD.getUIElem('content');oContent.onscroll=function()
{ebay.oDocument.oPage.hideSelElems();}}
else
ebay.oDocument.oPage.hideSelElems();if(oGreyLyr)
oGreyLyr.display(document.body.scrollWidth,document.body.scrollHeight);o.display();var aid=new EbayHTMLText(this,c.sActionElemName);aid.bind();aid.setValue(c.sActionValue);}
else
{bForceContinue=true;eElem.click();}}}
if(c.CarAdMsgLyr)
{this.oCarAdLyr=new EbayHTMLLayer(this,c.CarAdMsgLyr);this.oCarAdDYILink=new EbayHTMLAnchor(this,c.CarAdDYILink);this.oCarAdDYILink.onclick=function()
{var p=this.parent,oD=p.parent,ctls=p.controls,cfg=p.oCatConfig,aid,oBtn;aid=ctls[cfg.sActionElemName];if(!aid)
aid=new EbayHTMLText(p,cfg.sActionElemName);if(!aid.eElem)
aid.bind();aid.setValue('')
oBtn=ctls[cfg.sContinueButton];oBtn.bForceContinue=true;p.bCarAdCatSelected=false;oBtn.eElem.click();}}
this.bCarAdCatSelected=false;if(c.sStartOver)
{var oLink=new EbayHTMLAnchor(this,c.sStartOver);oLink.onclick=function()
{var p=this.parent;p.startOver(p.oCatConfig);}}
c=oD.getConfig("Selling.Categorize.RecommendCategory");if(c)
{var cCfg=ebay.oDocument.getConfig('Selling.Common');c.bOnFocus=cCfg.bOnFocus;c.sStartLyrName=cCfg.sStartLyrName;this.oOverlay=new EbayHTMLOverlayUrlDraggableToolbar(this,c.sLayerElemName,c);this.oGOL=new EbaySYI3Grayout(this,c.sGryLyr);this.oContinueButton.bForceContinue=false;this.hideSelElems=function(pCat)
{var oCat=pCat||this.controls['Selling.Categorize.Browse.Selector'];if(oCat)
{var c=oCat.controls;for(var i in c)
{if(c[i].eElem)
c[i].eElem.style.visibility='hidden';if(c[i].controls)
this.hideSelElems(c[i]);}}}}
var oSearchBtn=new EbayHTMLButton(this,'aidZ4');oSearchBtn.onclick=function()
{var p=this.parent,aE=p.oCatConfig.sActionElemName,aid=p.controls[aE];if(!aid)
aid=new EbayHTMLText(this,aE);if(!aid.eElem)
aid.bind();aid.setValue('4');}
this.oHelpSystem=new EbaySYIHelpSystem(this,"help system");this.oHelpSystem.bForceHelpPane=true;c=oD.getConfig("Selling.Categorize.MskuPrompt");if(c&&c.bMskuOption)
{this.oOverlay=new EbayHTMLOverlayUrl(this,c.sLayerElemName,c);this.oGOL=new EbaySYI3Grayout(this,c.sGryLyr);var p=this,sce=p.oCatConfig.aSelectedCategoryElems,cts=p.controls,o=p.oOverlay,sFirstCatValue,oGreyLyr=p.oGOL;var cCfg=ebay.oDocument.getConfig('Selling.Common');c.bOnFocus=cCfg.bOnFocus;c.sStartLyrName=cCfg.sStartLyrName;if(c.iCat1){sFirstCatValue=c.iCat1;var url=c.sUrl.replaceTokens(sFirstCatValue);if(c.iCat2)
url+="&cat2="+c.iCat2;oGreyLyr=p.oGOL;var vSInd=url.indexOf("&vMode="),vLInd=url.indexOf("&",vSInd+1);o.sUrl=url.substring(0,vSInd)+url.substr(vLInd)+"&ej2child=true";o.useIfShim=true;o.bDowngradeDomain=false;try
{var sFontSize=oUtils.oFontSizeDetector.getSize();o.sHeight=sFontSize>16&&sFontSize<21?450:sFontSize>21?500:c.height;}
catch(e)
{}
var haCtl=p._getControl("hlpFrm");o.iLeftPadding=haCtl.bIsShowing?-(haCtl.width()/2):0;if(haCtl.oMainLayer.eElem)
o.iTopPadding=haCtl.oMainLayer.eElem.scrollTop;if(oGreyLyr)
oGreyLyr.display(document.body.scrollWidth,document.body.scrollHeight);o.display();var aid=new EbayHTMLText(this,c.sActionElemName);aid.bind();aid.setValue(c.sActionValue);return false;}}
this.initSOJTagging(2);}

//38@@m2

function EbaySYI3ExpressCategory(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbaySYI3ExpressCategory";this.base=EbayHTMLCheckbox;this.base(pParent,pName,false,pCfg);this.aMetaData=[];this._registerEvent('onclick','updateExpressCat');with(this)
_registerListener(oDocument._getEvent("load"),EVENT_AFTER,"initMetaData");this.initMetaData=function()
{with(this)
{var oMC=parent.parent._getControl(this.oConfig.sSelectName);if(!oMC.eElem)
oMC.bind();var len=oMC.getOptionsLength();for(i=0;i<len;i++)
aMetaData[oMC.getValueByIndex(i)]=oMC.getValueByIndex(i,true);if(!eElem)
bind();var b=oConfig.bExpCatSelected||isChecked();if(b)
refreshMeta(oMC,b);}}
this.updateExpressCat=function()
{with(this)
{enable(false);var p=parent,lyrCtl=p.controls[oConfig.sLayerName],aSels=p.aSelectedCats,len=aSels.length;if(len>0)
{for(var i=0;i<len;i++)
{var v=aSels[i][0];if(typeof(v)!='undefined')
lyrCtl.removeSelection(v);}}
else
lyrCtl.resetBrowsePanel('');refreshMeta(p.parent._getControl(oConfig.sSelectName),isChecked());enable(true);}}
this.refreshMeta=function(pMeta,pChecked)
{var b=pChecked,aDC=this.oConfig.aDisabledCats,aDCL=aDC.length,oMC=pMeta;if(!oMC)
return;if(b)
{for(var j=0;j<aDCL;j++)
oMC.deleteOption(oMC.getIndexByValue(aDC[j]));}
else
{oMC.clearOptions();var oD=this.aMetaData;for(var md in oD)
oMC.createOption(md,oD[md]);}}}

//39@@m30

function EbayCategorySelectorFilmstripConfig(pName)
{if(!this.objType)
this.objType="EbayCategorySelectorConfig";this.base=EbayConfig;this.base(pName);this.sSelectName="";this.sLayerPrefix="lyr_";this.sUrl="";this.sForkSign=" >";this.bIsInline=false;this.bCategoryAllowsSecondCategory=false;this.bSecondMetaCategoryRefresh=false;this.sHtmlString='';this.sSelectedHtmlString='';this.sNotifyElemName='';}
function EbayCategorySelectorFilmstrip(pParent,pName,pConfig)
{if(!this.objType)
this.objType="EbayCategorySelectorFilmstrip";this.base=EbayHTML;this.base(pParent,pName);var c=this.oConfig=pConfig;this.aInitList=[];this.aMembers=[];this.aResponses=[];this.bPreselectCat=true;this.onHttpError=null;this.oTimer=null;if(c.sNonAjaxMode)
{this.oLoadJSDiv=new EbayHTMLLayer(this,c.sJSLoader);this.setData=function(pData)
{this.aResponses[this.sReqName]=pData;this.oRequestor.oData=pData;this.oRequestor.fillValues(true);}}
this.requestData=function(pUrl,pName,pRequestor)
{var reqN="req_"+pName,oC=this.oConfig;this.oRequestor=pRequestor;if(this.aResponses[reqN])
{this.oRequestor.oData=this.aResponses[reqN];this.oRequestor.fillValues(false);this.oRequestor=null;return;}
if(oC&&oC.sNonAjaxMode)
{this.oLoadJSDiv.setValue("");this.sReqName=reqN;oScript=this.oDocument.createElement('script');oScript.src=pUrl;this.oLoadJSDiv.eElem.appendChild(oScript);}
else
{var req=ebay.oServer.createRequest(reqN,pUrl,true);req.sPostData="";req.registerAsDataListener(this);req.send();}}
this.processDataResponse=function(pResp)
{this.aResponses[pResp.name]=pResp.oData;var p=pResp.parent;if(this.oRequestor&&p.iResponseType==p.RESPONSE_JS)
{this.oRequestor.oData=pResp.oData;this.oRequestor.fillValues(true);}
else
{if(this.onHttpError)
this.onHttpError(pResp);this.throwError("Invalid response. Response is not a JS type. [Response: "+encodeURIComponent(pResp.sResponseText.substr(0,100))+"...]","processDataResponse");}}
this.layerUpdate=function(pEvent)
{var pC=pEvent.parent.parent;var rt=this.parent.getRoot();var val=pC.getSelectedValue();if(!val)
return;var sIndex=pC.getSelectedIndex();var selOption=pC.eElem.options[sIndex];if(selOption&&selOption.id){pC.eElem.setAttribute('aria-activedescendant',selOption.id);}
this.writeUI(rt,pC);var oM=this.parent.addMember(this.name,this.sChildName,rt.oConfig.sLayerPrefix);oM.bind();this.fillValues(false);}
this.addMember=ebCategorySelectorFilmstripAddMember;this.bindHTML=function()
{this.addMember(this.name,this.oConfig.sSelectName,this.oConfig.sLayerPrefix).bind();}
this.onLeafSelection=null;this.onNodeSelection=null;this.killResponses=function()
{for(var i in this.aResponses)
{this.aResponses[i]=null;}
this.aResponses=[];if(this.oConfig.sNonAjaxMode)
return;if(this.oRequestor)
this.oRequestor=this.oRequestor.oData=null;ebay.oServer.oDataReciever=null;}
with(this)
{_registerListener(oDocument._getEvent("unload"),EVENT_BEFORE,"killResponses");}
this.checkResponse=function()
{var ctls=this.controls;for(var i in ctls)
{var oL=ctls[i].oList;if(oL)
oL.enable(true);}}}
function ebCategorySelectorFilmstripAddMember(pName,pSel,pLPre)
{var csm=new EbayCategorySelectorFilmstripMember(this,"member_"+pSel,pSel,pLPre+pSel),len;csm.oLayer.onLayerUpdate=this.layerUpdate;if(this.objType=="EbayCategorySelectorFilmstrip")
csm.sSelectedValue=this.aInitList[0];else
{var aI=this.getRoot().aInitList;len=aI.length;for(var i=0;i<len;i++)
{if(aI[i]==this.sSelectedValue)
{if(aI[i+1])
{csm.sSelectedValue=aI[i+1];break;}}}}
len=this.aMembers.length;for(var i=0;i<len;i++)
{if(csm.name==this.aMembers[i].name)
{this.aMembers[i]=csm;return csm;}}
this.aMembers[this.aMembers.length]=csm;return csm;}
function EbayCategorySelectorFilmstripMember(pParent,pName,pListName,pLayerName)
{if(!this.objType)
this.objType="EbayCategorySelectorFilmstripMember";this.base=EbayHTML;this.base(pParent,pName);this.sListName=pListName;this.sLayerName=pLayerName;this.sSelectedValue="";this.aMembers=[];this.addMember=ebCategorySelectorFilmstripAddMember;this.layerUpdate=pParent.layerUpdate;this.getRoot=ebCategorySelectorFilmstripGetRoot;this.oList=new EbayHTMLSelect(this,this.sListName);var e=this.oList._registerEvent("onchange","");this.oLayer=new EbayHTMLCategorySelectorLayer(this,this.sLayerName);this.oLayer.setListener(e);this.bindHTML=ebCategorySelectorFilmstripMemberBindHTML;}
function ebCategorySelectorFilmstripGetRoot()
{var rt=this;while(rt&&rt.objType!="EbayCategorySelectorFilmstrip")
{rt=rt.parent;}
return rt;}
function ebCategorySelectorFilmstripMemberBindHTML(pNoRebind)
{with(this)
{if(!pNoRebind)
{oList.bind();oLayer.bind();}
if(sSelectedValue)
{oList.selectByValue(sSelectedValue);if(oList.iSelIndex>=0)
oList._exec("onchange");}}}
function EbayHTMLCategorySelectorLayer(pParent,pName)
{if(!this.objType)
this.objType="EbayHTMLCategorySelectorLayer";this.base=EbayHTMLLayer;this.base(pParent,pName);this.oData=null;this.setListener=ebHTMLCategorySelectorLayerSetListener;this.writeUI=ebHTMLCategorySelectorLayerWriteUI;this.fillValues=ebHTMLCategorySelectorLayerFillValues;this.sChildName="";this.onLayerUpdate=null;}
function ebHTMLCategorySelectorLayerSetListener(pEvent)
{this._registerListener(pEvent,this.EVENT_AFTER,"onLayerUpdate")}
function ebHTMLCategorySelectorLayerWriteUI(pParent,pC)
{var s="",pc=pParent.oConfig,w=pC.width();var cn=this.sChildName="o_"+pC.name;s="<label for='"+cn+"' class='g-hdn'>"+pc.sCategorySelectorLabel+"</label>"+"<select aria-label='"+pc.sCategorySelectorLabel+"' id='"+cn+"' name='"+cn+"' size='"+pC.eElem.size+"' style='"+(w>0?("width:"+w+"px"):"")+"' />";var l="<div style='position:relative' id='"+pc.sLayerPrefix+cn+"'>&nbsp;</div>";this.setValue(pc.sHtmlString.replaceTokens(s,l));var cat_tr=document.getElementById("catboxes_row_1");var isiPad=navigator.userAgent.match(/iPad/i)!=null;var isiPhone=navigator.userAgent.match(/iPhone/i)!=null;var cg=this.sCatListConfigName="Selling.Categorize.Browse",c=ebay.oD.getConfig(cg);if((cat_tr&&c.bIOSCategoryUI)&&(isiPad||isiPhone))
{cat_tr.firstChild.vAlign="";}}
function ebHTMLCategorySelectorLayerFillValues(pFromServer)
{var isTesting=false;var csm=this.parent;var rt=csm.getRoot(),rc=rt.oConfig;var oL=csm.oList,val=oL.getSelectedValue();var cp=rt.oUtils.controlPath(rt);var ariaLyr=null;if(rc.sARIAMsgLyr&&rt.parent){ariaLyr=rt.parent.controls[rc.sARIAMsgLyr];}
rt.oTimer=setTimeout(cp+'.checkResponse()',1000);oL.enable(pFromServer);var oD=this.oData,isReq=(oD==null);if(oD)
{rt.bCategoryAllowsSecondCategory=(oD.CategoryAllowsSecondCategory=='true');rt.bSecondMetaCategoryRefresh=(oD.SecondMetaCategoryRefresh=='true');}
var parentLayer=this.parent.parent.oLayer,isLeaf=false,bCarAd=false,b2ndCatAtLeaf=true;if(parentLayer)
{var oT=parentLayer.oData.getNode("Category","id",val);if(oT)
{isLeaf=(oT.aAttribs["isLeaf"]=="true");bCarAd=(oT.aAttribs["isCarAdCategory"]=="true")||false;b2ndCatAtLeaf=oT.CategoryAllowsSecondCategory=='false'?false:true;}}
if(!isReq)
{if(oD)
{oD=this.oData.getNode("Category","id",val);if(oD)
{isLeaf=(oD.aAttribs["isLeaf"]=="true");bCarAd=(oD.aAttribs["isCarAdCategory"]=="true")||false;b2ndCatAtLeaf=oD.CategoryAllowsSecondCategory=='false'?false:true;}}
isReq=(oD==null||oD.aChildNodes.length==0);}
if(isReq&&!isLeaf&&!pFromServer)
{var reqUrl=rc.sUrl.replaceTokens(val)+'&rd='+Math.ceil((Math.random()*1000000));rt.requestData(reqUrl,val,this);return;}
else
{clearTimeout(rt.oTimer);oL.enable(true);}
if(isLeaf)
{if(rt.onLeafSelection!=null)
rt._exec("onLeafSelection",this.parent.oList,bCarAd,b2ndCatAtLeaf);if(rc.name=="Selling.Categorize.Browse.Selector"&&parentLayer){var catSelObj=document.getElementById(parentLayer.sChildName);if(catSelObj){catSelObj.focus();}}
this.setValue(rc.sSelectedHtmlString);this.eElem.parentElement.className='broCatSelTD';var cfg=this.sCatListConfigName="Selling.Categorize.Browse",c=ebay.oD.getConfig(cfg);var isiPad=navigator.userAgent.match(/iPad/i)!=null;var isiPhone=navigator.userAgent.match(/iPhone/i)!=null;if((c.bIOSCategoryUI)&&(isiPad||isiPhone))
{this.eElem.firstChild.style.height='0px';}
if(ariaLyr&&rc.sARIALeafMsg){ariaLyr.setValue(rc.sARIALeafMsg);}}
else
{this.eElem.parentNode.className="";if(rt.onNodeSelection!=null)
rt._exec("onNodeSelection",this.parent.oList);if(rc.name=="Selling.Categorize.Browse.Selector"){var onNodelyrId=this.eElem.id;var onNodeSelId=onNodelyrId.replace("lyr_","");var onNodeSelObj=document.getElementById(onNodeSelId);if(onNodeSelObj){onNodeSelObj.focus();}}
if(oD==null&&this.oData!=null)
oD=this.oData;if(oD==null)return;var oOD=oD.aChildNodes,lyrLeft,l=oOD.length,len=csm.aMembers.length;for(var j=0;j<len;j++)
{var oM=csm.aMembers[j];var oL=oM.oList,v,t,tmp;oL.clearOptions();var cnm=this.sCatListConfigName="Selling.Categorize.Browse",c=ebay.oD.getConfig(cnm);var isiPad=navigator.userAgent.match(/iPad/i)!=null;var isiPhone=navigator.userAgent.match(/iPhone/i)!=null;if((c.bIOSCategoryUI)&&(isiPad||isiPhone)){sel_Option=document.createElement("option");sel_Option.text=c.sDefTxt;sel_Option.disabled='disabled';sel_Option.setAttribute("selected","true");var z=oL.eElem[0];oL.eElem.add(sel_Option,z);}
for(var i=0;i<l;i++)
{var aAttrib=oOD[i].aAttribs,bm=aAttrib['bMode'],expExc=aAttrib['isEbayExpressExcluded'];var b=false,v,t,bBM,bExc;if(rc.sExpCatName)
b=rt.parent.controls[rc.sExpCatName].isChecked();bBM=typeof(bm)!='undefined'?(bm.toUpperCase().hasAny('DISABLE','FALSE')?false:true):true;bExc=(typeof(expExc)!='undefined'?(expExc.toUpperCase().is('TRUE')?true:false):false)&&b;if(!bBM||bExc)
continue;v=oOD[i].aAttribs["id"];t=oOD[i].Name+(!aAttrib["isLeaf"].is('true')?rc.sForkSign:"");oL.createOption(v,t);var curOptionEl=oL.eElem.options[i];if(curOptionEl){curOptionEl.setAttribute('id',oL.name+'option_'+v);curOptionEl.setAttribute('role','option');}}
lyrLeft=oM.oLayer.left();if(rt.bPreselectCat&&oM.sSelectedValue&&oL.iSelIndex==-1)
{oL.selectByValue(oM.sSelectedValue);if(oL.iSelIndex>=0)
oL._exec("onchange");}}
if(ariaLyr&&rc.sARIAMsg){ariaLyr.setValue(rc.sARIAMsg);}}
if(!rc.bIsInline)
{var dB=this.oDocument.doc.body;var iS=dB.scrollWidth-dB.offsetWidth;if(iS>0)
this.oDocument.win.scrollBy(iS+10,0);}
else
{var oD=this.oDocument,oP=oD.oPage;c=oD.getConfig(oP.sCatListConfigName);var lyr_catboxes=oP.controls[c.sCatBoxesLayerName];var iLeft=lyr_catboxes.eElem.scrollLeft,iS=lyr_catboxes.eElem.scrollWidth-lyr_catboxes.width();if(iS>0)
lyr_catboxes.eElem.scrollLeft=iLeft+iS;}}

//40@@m15

function EbaySYI3VariationOverlay(pParent,pName,pCfg){if(!this.objType)this.objType="EbaySYI3VariationOverlay";var cCfg=ebay.oDocument.getConfig('Selling.Common');pCfg.bOnFocus=cCfg.bOnFocus;pCfg.sStartLyrName=cCfg.sStartLyrName;var c=pCfg,oD=this.oDocument;this.base=EbayBaseControl;this.base(pParent,pName);this.oConfig=pCfg;this.bCreateVariation=c.bCreateVariation;this.bBrowsePage=c.bBrowsePage;this.bVariationPage=c.bVariationPage;this.bPicturePage=c.bPicturePage;var QP=ebay.oP.controls['QuantityPrice_variation'];this.bMSKUPicturePage=c.bMSKUPicturePage;if(c.sFormName)this.oForm=this.parent.getFormObj(c.sFormName);this.oAid=new EbayHTMLText(this,c.sAidElem);this.sAid=c.sAidElem;this.aFP=c.aFormPosts;this.iHiddenAid=c.sHiddenAid;this.aCloseIds=c.aoverlayIds.closeOvrlids;this.aShowOverlayBtn=c.aoverlayIds.aShowOverlayBtn;this.aShowQuantityBtn=c.aoverlayIds.aShowQuantityBtn;this.aRemoveBtnElem=c.aRemoveBtnElem;if(c.bBrowsePage){this.soverrideVariations=c.soverrideVariations;this.sHiddenCat1=c.sHiddenCat1;this.sHiddenCat2=c.sHiddenCat2;this.iNewCategory=c.iNewCategory;this.sprevCat1=c.sprevCat1;this.sprevCat2=c.sprevCat2;this.sPrimaryCat=c.sPrimaryCat;}
this.oShowOverlayBtn=[];this.oShowQuantityBtn=[];this.closeBtns=[];this.of=this.oDocument.createElement('form');this.of.setAttribute("id","VariationOverlayForm");this.of.setAttribute("name","VariationOverlayForm");var len=this.aShowOverlayBtn.length;for(var i=0;i<len;i++){this.oShowOverlayBtn[i]=new EbayHTMLButton(this,this.aShowOverlayBtn[i]);}
if(QP){var len2=this.aRemoveBtnElem.length;for(var k=0;k<len2;k++){this.aRemoveBtnElem[k]=new EbayHTMLButton(this,this.aRemoveBtnElem[k]);}}
if(this.aShowQuantityBtn){var len1=this.aShowQuantityBtn.length;for(var j=0;j<len1;j++){this.oShowQuantityBtn[j]=new EbayHTMLButton(this,this.aShowQuantityBtn[j]);}}
this.oCreateStBtn=new EbayHTMLButton(this,c.aoverlayIds.actionBtn);this.oGOL=new EbaySYI3Grayout(this,c.sGryLyr);this.oFixedPriceAmt=this.oDocument.getUIElem(c.aoverlayIds.textboxOverlayId);this.oQuantityamt=this.oDocument.getUIElem(c.aoverlayIds.QuantityamtTxt);len=this.aCloseIds.length;for(var i=0;i<len;i++){if(c.bBrowsePage&&i==0)this.closeBtns[i]=new EbayHTMLAnchor(this,this.aCloseIds[i]);else this.closeBtns[i]=new EbayHTMLButton(this,this.aCloseIds[i]);}
this.oWarningVariationOverlay=new EbayHTMLOverlayContent(this,c.sConfirmOverlay,c);this.oQuantityVariationOverlay=new EbayHTMLOverlayContent(this,c.sQuantityOverlay,c);if(this.bBrowsePage&&!this.oDocument.getUIElem(c.sConfirmOverlay).form){odiv=this.oDocument.getUIElem(c.sConfirmOverlay);this.oDocument.doc.body.appendChild(this.of);this.of.appendChild(odiv);}
this.oOverideVariationHidden=new EbayHTMLText(this,c.soverrideVariations);this.oPictureTrait=new EbayHTMLText(this,c.sTraitHiddenName);this.oErrorLyr=new EbayHTMLLayer(this,c.sErrDivid);this.init=function(){with(this){if(oErrorLyr)oErrorLyr.bind();var len2=aShowOverlayBtn.length;for(var i=0;i<len2;i++){if(!oShowOverlayBtn[i].eElem)oShowOverlayBtn[i].bind();if(!QP&&c.bMSKUPicturePage){if(oShowOverlayBtn[0].name==aShowOverlayBtn)
{oShowOverlayBtn[i]._registerEvent('onchange','parent.createVariation');}}
else
{oShowOverlayBtn[i]._registerEvent('onclick','parent.createVariation');}
oShowOverlayBtn[i].bind();_registerListener(ebay.oDocument._getEvent('resize'),this.EVENT_AFTER,'resize');}
if(aShowQuantityBtn){var lenn2=aShowOverlayBtn.length;for(var j=0;j<lenn2;j++){if(!oShowQuantityBtn[j].eElem)oShowQuantityBtn[j].bind();oShowQuantityBtn[j]._registerEvent('onclick','parent.createQuantity');oShowQuantityBtn[j].bind();_registerListener(ebay.oDocument._getEvent('resize'),this.EVENT_AFTER,'resize');}}
if(QP){if(aRemoveBtnElem){var lenk2=aRemoveBtnElem.length;for(var k=0;k<lenk2;k++){if(!aRemoveBtnElem[k].eElem)aRemoveBtnElem[k].bind();aRemoveBtnElem[k]._registerEvent('onclick','parent.Removebtn');aRemoveBtnElem[k].bind();_registerListener(ebay.oDocument._getEvent('resize'),this.EVENT_AFTER,'resize');}}}
oCreateStBtn._registerEvent('onclick','parent.RemoveWarning');oCreateStBtn.bind();len2=aCloseIds.length;for(var i=0;i<len2;i++){closeBtns[i].subscribeEvents("onblur");closeBtns[i]._registerEvent('onclick','parent.closeOverlayVariation');closeBtns[i]._registerEvent('onblur','parent.retainFocusOverlay');closeBtns[i].bind();}
for(var i in aFP){var oLink=this.oLink=new EbayHTMLAnchor(this,i);oLink._registerEvent('onclick','parent.formPost');}}
this.resize=function(){var p=this.parent,pp=p.parent,c=pp.oConfig,overlay=p.oWarningVariationOverlay,overlayElem=typeof overlay!='undefined';if(!QP&&c&&c.bMSKUPicturePage){if(p.oShowOverlayBtn[0].eElem.disabled==true)
{var overlay=p.oWarningVariationOverlay;}}
else
{if(p.oWarningVariationOverlay.eElem.style.display!="none"){var overlay=p.oWarningVariationOverlay;}
else{var overlay=p.oQuantityVariationOverlay;}}
if(overlayElem){overlay.eElem.style.top=((ebay.oDocument.doc.body.clientHeight-overlay.eElem.offsetHeight)/2)+ebay.oGlobals.oClient.getScrollTop();overlay.eElem.style.left=((ebay.oDocument.doc.body.clientWidth-overlay.eElem.offsetWidth)/2)+ebay.oGlobals.oClient.getScrollLeft();}}
this.hideGrayOut=function(){var gLyr=this.oGOL;if(gLyr){gLyr.hide();}}
this.retainFocusOverlay=function(){var sTextBox=this.parent.oConfig.aoverlayIds.stextboxOverlayId;if(sTextBox){var oTextBox=ebay.oDocument.getUIElem(sTextBox);if(oTextBox)oTextBox.focus(true);}else{OverlayCntrl=ebay.oP.controls['variation_overlay'];if(OverlayCntrl)OverlayCntrl.closeBtns[1].focus(true);else{s=this.parent.aCloseIds[1]+".focus(true);";setTimeout(s,10);}}}
this.closeOverlayVariation=function(){var p=this.parent,pp=p.parent,c=pp.oConfig;if(!QP&&c.bMSKUPicturePage){if(p.oShowOverlayBtn[0].eElem.disabled==true)
{var overlay=p.oWarningVariationOverlay;}}
else
{if(p.oWarningVariationOverlay.eElem.style.display!="none"){var overlay=p.oWarningVariationOverlay;}
else{var overlay=p.oQuantityVariationOverlay;}}
if(p.oPictureTrait&&p.oPictureTrait.eElem){var tochange=p.oPictureTrait.eElem.value;len=p.oShowOverlayBtn[0].eElem.length;for(var i=0;i<len;i++)
{if(p.oShowOverlayBtn[0].eElem[i].text===tochange)
p.oShowOverlayBtn[0].eElem[i].selected="true";}}
if(p.bBrowsePage){oHiddenCat1=new EbayHTMLText(this,p.sHiddenCat1);if(!oHiddenCat1.eElem)oHiddenCat1.bind();oHiddenCat1.setValue(p.sPrimaryCat);oHiddenCat2=new EbayHTMLText(this,p.sHiddenCat2);if(!oHiddenCat2.eElem)oHiddenCat2.bind();oHiddenCat2.setValue("");oHiddenPrevCat2=new EbayHTMLText(this,p.sprevCat2);if(!oHiddenPrevCat2.eElem)oHiddenPrevCat2.bind();oHiddenPrevCat2.setValue("");if(!p.oOverideVariationHidden.eElem)p.oOverideVariationHidden.bind();p.oOverideVariationHidden.setValue(false);oForm=pp.oContinueButton.eElem.form;oForm['aid'].value=p.iHiddenAid;ebay.oDocument.oPage.bShowAlert=false;oForm.submit();return false;}else{overlay.show();p.hideGrayOut();if(c.bMSKUPicturePage){var g=p.oShowOverlayBtn[0].eElem.options;for(var i=0;i<p.oShowOverlayBtn[0].eElem.length;i++)
if(g[i].text==p.oPictureTrait.eElem.value)
p.oShowOverlayBtn[0].eElem.selectedIndex=i;}
if(p.oShowQuantityBtn[0]&&overlay.name=="QuantityOverlay_secGrp"){p.oShowQuantityBtn[0].bind();p.oShowQuantityBtn[0].focus(true);}
if(p.oShowOverlayBtn[0]&&overlay.name=="ConfirmOverlay_secGrp"){p.oShowOverlayBtn[0].bind();p.oShowOverlayBtn[0].focus(true);}
return false;}}
this.RemoveWarning=function(){var p=this.parent,pp=p.parent,c=p.oConfig,overlay=p.oWarningVariationOverlay;if(!QP&&c.bMSKUPicturePage){if(p.oShowOverlayBtn[0].eElem.disabled==true)
{var overlay=p.oWarningVariationOverlay;}}
else
{if(p.oWarningVariationOverlay.eElem.style.display!="none"){var overlay=p.oWarningVariationOverlay;}
else{var overlay=p.oQuantityVariationOverlay;}}
overlay.show();if(p.bCreateVariation||p.bVariationPage){if(c.bDyi){oForm=this.parent.parent.getFormObj(c.sFormName);p.hideGrayOut();}else{oForm=new EbayHTMLForm(this,'selling');oForm.bind();}
if(p.bVariationPage){p.hideGrayOut();}
oForm.eElem.elements['aid'].value=p.iHiddenAid;if(!p.oOverideVariationHidden.eElem)p.oOverideVariationHidden.bind();p.oOverideVariationHidden.setValue(true);ebay.oDocument.oPage.bShowAlert=false;oForm.submit();return false;}else if(p.bBrowsePage){if(!p.oOverideVariationHidden.eElem)p.oOverideVariationHidden.bind();p.oOverideVariationHidden.setValue(true);oHiddenCat1=new EbayHTMLText(this,p.sHiddenCat1);if(!oHiddenCat1.eElem)oHiddenCat1.bind();oHiddenCat1.setValue(p.iNewCategory);oForm=new EbayHTMLForm(this,'selling');oForm.bind();ebay.oDocument.oPage.bShowAlert=false;oForm.submit();return false;p.hideGrayOut();}else if(p.bPicturePage){overlay.eElem.appendChild(p.of);if(!p.oPictureTrait.eElem)p.oPictureTrait.bind();var oVairationRow=this.oDocument.getUIElem(c.sTraitName).parentNode.parentNode;var child=oVairationRow.childNodes,len3=child.length;for(i=0;i<len3;i++){var grandchild=child[i].childNodes,len4=grandchild.length;for(j=0;j<len4;j++){if(p.bMSKUPicturePage){if((grandchild[j].id==c.sTraitName)&&(grandchild[j].selected)){p.oPictureTrait.setValue(grandchild[j].innerHTML);}}
else
{if((grandchild[j].id==c.sTraitName)&&(grandchild[j].checked)){p.oPictureTrait.setValue(grandchild[j].value);}}}}
oForm=new EbayHTMLForm(this,'selling');oForm.bind();oForm.eElem.elements['aid'].value=p.iHiddenAid;ebay.oDocument.oPage.bShowAlert=false;oForm.submit();return false;}else{overlay.eElem.appendChild(p.of);if(overlay.eElem.id==p.oWarningVariationOverlay.eElem.id){p.oFixedPriceAmt=this.oDocument.getUIElem("FixedPriceamtTxt");for(i in pp.aQuantity){var oVaraitionAmt=pp.oAmtTxt[i];if(oVaraitionAmt){oVaraitionAmt.bind();if(pp.oQtyChk[i].isChecked()&&p.oFixedPriceAmt.value!='')oVaraitionAmt.setValue(p.oFixedPriceAmt.value);}}}
p.hideGrayOut();if(overlay.eElem.id==p.oQuantityVariationOverlay.eElem.id){p.oQuantityamt=this.oDocument.getUIElem("QuantityamtTxt");for(i in pp.aQuantity){var oVaraitionQty=pp.oQtyTxt[i];if(oVaraitionQty){oVaraitionQty.bind();if(pp.oQtyChk[i].isChecked()&&p.oQuantityamt.value!='')oVaraitionQty.setValue(p.oQuantityamt.value);}}}
p.hideGrayOut();}
if(p.oShowOverlayBtn[0]){p.oShowOverlayBtn[0].bind();p.oShowOverlayBtn[0].focus(true);}}
if(QP){this.Removebtn=function(){var p=this.parent,pp=p.parent,berrmsg=false;this.outb=[];this.outd=[];if(pp.oQtyChk){ChkBox=pp.oQtyChk;for(i in ChkBox){if(ChkBox[i].isChecked()){var k=i.replace(/v/,"");this.outb[k]=new EbayHTMLLayer(this,pp.sRemoverLyrPrefix.replace("<#1#>",k));this.outb[k].bind();var dis=this.outb[k].eElem.style.display;if(dis!="none"&&ChkBox[i].isChecked())
berrmsg=ChkBox[i].isChecked();else
berrmsg=false;this.outb[k].eElem.style.display="none";if(k==0)
k=0;else
k=k-1;this.outd[k]=new EbayHTMLLayer(this,pp.sDividerLyrPrefix.replace("<#1#>",k));this.outd[k].bind();this.outd[k].eElem.style.display="none";}}}
if(berrmsg){if(p.oErrorLyr)p.oErrorLyr.show();return false;}else{if(p.oErrorLyr)p.oErrorLyr.show(true);}}}
this.createQuantity=function(){var p=this.parent,pp=p.parent,c=pp.oConfig,overlay=p.oQuantityVariationOverlay,oGreyLyr=p.oGOL,aLocs,bShowOverlay=true,berrmsg=false;OverlayCntrl=ebay.oP.controls['variation_overlay'];this.outb=[];if(pp.oQtyChk){ChkBox=pp.oQtyChk;for(i in ChkBox){if(ChkBox[i].isChecked()){var k=i.replace(/v/,"");this.outb[k]=new EbayHTMLLayer(this,pp.sRemoverLyrPrefix.replace("<#1#>",k));this.outb[k].bind();var dis=this.outb[k].eElem.style.display;if(dis!="none"&&ChkBox[i].isChecked())
berrmsg=ChkBox[i].isChecked();else
berrmsg=false;}}}
if(QP)
{if(!berrmsg)bShowOverlay=false;}
if((pp.iTotal!=0||pp.iTotal>0)&&(bShowOverlay)){if(!overlay)overlay=OverlayCntrl.oQuantityVariationOverlay;if(!oGreyLyr)oGreyLyr=OverlayCntrl.oGOL;overlay.bNoSetContent=true;overlay.bForceReposition=false;overlay.useIfShim=true;overlay.iTopPadding=0;aLocs=ebay.oUtils.oPositioning.getOffsetLeftTop(overlay.eElem);aLocs[0]=aLocs[1]=0;overlay.sTop=(aLocs[1]+ebay.oDocument.doc.body.clientHeight/2+ebay.oGlobals.oClient.getScrollTop()/2-30)+'px';overlay.sLeft=(aLocs[0]+ebay.oDocument.doc.body.clientWidth/2+ebay.oGlobals.oClient.getScrollLeft()/2-230)+'px';overlay.display();overlay.setIframeShim();cfg=p.aConfigs?p.aConfigs['Selling.variation.RemoveVariation']:'';if(cfg&&cfg.bVariationPage){odiv=this.oDocument.getUIElem(cfg.sConfirmOverlay);this.oDocument.doc.body.appendChild(OverlayCntrl.of);OverlayCntrl.of.appendChild(odiv);OverlayCntrl.closeBtns[1].bind();}
if(p.oConfig&&p.oConfig.bPriceQuantity){var sTextBox=p.oConfig.aoverlayIds.QuantityamtTxt;if(sTextBox)var oTextBox=ebay.oDocument.getUIElem(sTextBox);if(oTextBox)oTextBox.focus(true);}else{OverlayCntrl=ebay.oP.controls['variation_overlay'];if(OverlayCntrl)OverlayCntrl.closeBtns[1].focus(true);else{s=this.parent.aCloseIds[1]+".focus(true);";setTimeout(s,10);}}
if(p.oQuantityamt)p.oQuantityamt.value="";if(overlay.eElem){overlay.eElem.lastChild.style.height=overlay.eElem.offsetHeight-2;overlay.eElem.lastChild.style.width=overlay.eElem.offsetWidth-2;}
if(oGreyLyr)oGreyLyr.display(document.body.scrollWidth,document.body.scrollHeight);if(p.oErrorLyr)p.oErrorLyr.show();return false;}else if(p.bCreateVariation){oForm=this.eElem.form;oForm['aid'].value=p.iHiddenAid;ebay.oDocument.oPage.bShowAlert=false;oForm.submit();return false;}else{if(p.oErrorLyr)p.oErrorLyr.show(true);}
this.formPost=function(){ebay.oDocument.oPage.bShowAlert=false;var oSellForm=this.parent.oForm,aFP=this.parent.aFP;if(!oSellForm.eElem)oSellForm.bind();oSellForm.onBeforeSubmit=this.parent.parent.updateRTEDesc;oSellForm.eElem.elements[this.parent.sAid].value=aFP[this.name];oSellForm.submit();return false;}
this.init();}
this.createVariation=function(){var p=this.parent,pp=p.parent,c=pp.oConfig,overlay=p.oWarningVariationOverlay,oGreyLyr=p.oGOL,aLocs,bShowOverlay=true,berrmsg=false;OverlayCntrl=ebay.oP.controls['variation_overlay'];this.outb=[];if(pp.oQtyChk){ChkBox=pp.oQtyChk;for(i in ChkBox){if(ChkBox[i].isChecked()){var k=i.replace(/v/,"");this.outb[k]=new EbayHTMLLayer(this,pp.sRemoverLyrPrefix.replace("<#1#>",k));this.outb[k].bind();var dis=this.outb[k].eElem.style.display;if(dis!="none"&&ChkBox[i].isChecked())
berrmsg=ChkBox[i].isChecked();else
berrmsg=false;}}}
var QP=ebay.oP.controls['QuantityPrice_variation'];if(!QP){if(typeof c!="undefined"&&c.bMSKURevamp)bShowOverlay=false;}
if(QP)
{if(!berrmsg)bShowOverlay=false;}
if((pp.iTotal!=0||pp.iTotal>0)&&(bShowOverlay)){if(!overlay)overlay=OverlayCntrl.oWarningVariationOverlay;if(!oGreyLyr)oGreyLyr=OverlayCntrl.oGOL;overlay.bNoSetContent=true;overlay.bForceReposition=false;overlay.useIfShim=true;overlay.iTopPadding=0;aLocs=ebay.oUtils.oPositioning.getOffsetLeftTop(overlay.eElem);aLocs[0]=aLocs[1]=0;overlay.sTop=(aLocs[1]+ebay.oDocument.doc.body.clientHeight/2+ebay.oGlobals.oClient.getScrollTop()/2-30)+'px';overlay.sLeft=(aLocs[0]+ebay.oDocument.doc.body.clientWidth/2+ebay.oGlobals.oClient.getScrollLeft()/2-230)+'px';overlay.display();overlay.setIframeShim();cfg=p.aConfigs?p.aConfigs['Selling.variation.RemoveVariation']:'';if(cfg&&cfg.bVariationPage){odiv=this.oDocument.getUIElem(cfg.sConfirmOverlay);this.oDocument.doc.body.appendChild(OverlayCntrl.of);OverlayCntrl.of.appendChild(odiv);OverlayCntrl.closeBtns[1].bind();}
if(p.oConfig&&p.oConfig.bPriceQuantity){var sTextBox=p.oConfig.aoverlayIds.stextboxOverlayId;if(sTextBox)var oTextBox=ebay.oDocument.getUIElem(sTextBox);if(oTextBox)oTextBox.focus(true);}else{OverlayCntrl=ebay.oP.controls['variation_overlay'];if(OverlayCntrl)OverlayCntrl.closeBtns[1].focus(true);else{s=this.parent.aCloseIds[1]+".focus(true);";setTimeout(s,10);}}
if(p.oFixedPriceAmt)p.oFixedPriceAmt.value="";if(overlay.eElem){overlay.eElem.lastChild.style.height=overlay.eElem.offsetHeight-2;overlay.eElem.lastChild.style.width=overlay.eElem.offsetWidth-2;}
if(oGreyLyr)oGreyLyr.display(document.body.scrollWidth,document.body.scrollHeight);if(p.oErrorLyr)p.oErrorLyr.show();return false;}else if(p.bCreateVariation){oForm=this.eElem.form;oForm['aid'].value=p.iHiddenAid;ebay.oDocument.oPage.bShowAlert=false;oForm.submit();return false;}else{if(p.oErrorLyr)p.oErrorLyr.show(true);}}
this.formPost=function(){ebay.oDocument.oPage.bShowAlert=false;var oSellForm=this.parent.oForm,aFP=this.parent.aFP;if(!oSellForm.eElem)oSellForm.bind();oSellForm.onBeforeSubmit=this.parent.parent.updateRTEDesc;oSellForm.eElem.elements[this.parent.sAid].value=aFP[this.name];oSellForm.submit();return false;}}
this.init();}

//41@@m65

ebay.oP.bOverrideDataNode=false;function EbayMotorsDataNode(pParent,pName)
{if(!this.objType)
this.objType="EbayMotorsDataNode";this.base=EbayDataNode;if(ebay.oDocument&&ebay.oP&&ebay.oP.bOverrideDataNode==true&&pParent==null)
{pParent=ebay.oP.oEbayDataNodeStorage;}
this.base(pParent,pName);}
window.__ENd=EbayMotorsDataNode;ebay.oP.onBeforeLoad=function()
{var oD=this.parent;c=oD.getConfig("Selling.Catalog.AutoComplete");if(c)
new EbaySYICatalogAutoComplete(this,"clgautocmpl",c);c=oD.getConfig("Selling.Categorize.ChangeCategoryVariationOverlay");if(c){new EbaySYI3VariationOverlay(this,'variation_overlay',c);this._registerListener(ebay.oDocument._getEvent('load'),this.EVENT_AFTER,"controls['variation_overlay'].createVariation");}
var cnm=this.sCatListConfigName="Selling.Categorize.Browse";var c=oD.getConfig(cnm),lyrName=c.sLayerName;this.initCategories();this.initCategoryShared(c);var lyr_catboxes=this.oDocument.oPage.controls[c.sCatBoxesLayerName];if(!lyr_catboxes.eElem)
lyr_catboxes.bind();var isiPad=navigator.userAgent.match(/iPad/i)!=null;var isiPhone=navigator.userAgent.match(/iPhone/i)!=null;if((c.bIOSCategoryUI)&&(isiPad||isiPhone)){lyr_catboxes.eElem.style.height='auto';lyr_catboxes.eElem.style.border='none';var aSelct=document.getElementById('fcat');option=document.createElement("option");option.text=c.sDefTxt;option.disabled='disabled';option.setAttribute("selected","true");aSelct.add(option,aSelct[0]);}
this.oHelpSystem.bWaitForAjaxCall=true;this.bContinueClicked=false;this.b2ndCatAllowed=c.bCanAdd2ndCat;this.b2ndCatAllowedAtLeaf=true;this.oEbayDataNodeStorage=new EbayDataNode(null,'Storage');this.bOverrideDataNode=false;oLnk=new EbayHTMLAnchor(this,'errFocusId');if(!oLnk.eElem)
oLnk.bind();if(oLnk){oLnk.focus(true);}
if(!c.bCat1Editable)
this.isSecondary=true;if(c.aSearchLinks)
{var len=c.aSearchLinks.length;for(var i=0;i<len;i++)
{var oSearch=new EbayHTMLAnchor(this,c.aSearchLinks[i]);oSearch.onclick=function()
{var p=this.parent,cfg=p.parent.getConfig('Selling.Categorize.Browse'),e=this.eElem,href=e.href,catElems=cfg.aSelectedCategoryElems,len=catElems.length;for(var i=0;i<len;i++)
{var ctl=p.controls[catElems[i]];if(ctl)
href+='&'+catElems[i]+'='+ctl.getValue();}
this.oDocument.redirect(href);return false;}}}
new EbaySYI3LearnMorePopup(this,'learn_more_popup',c);c=oD.getConfig("Selling.Categorize.Browse.Selector");var scs=new EbayCategorySelectorFilmstrip(this,c.name,c);scs.onLeafSelection=function(pList)
{}
var e=scs._registerEvent("onLeafSelection","");var parC=oD._getControl(c.sNotifyElemName);if(parC)
parC.setupListeners(e);scs.onHttpError=function(pResp)
{if(parC.onHttpError)
parC.onHttpError(pResp);}
this.sExpCatName=c.sExpCatName;if(this.sExpCatName)
{c.sLayerName=lyrName;new EbaySYI3ExpressCategory(this,this.sExpCatName,c);}
if(c.aLearnMores)
{var aL=c.aLearnMores,len=aL.length;for(var i=0;i<len;i++)
{var a=new EbayHTMLAnchor(this,aL[i]);a.onclick=function()
{var oPop=this.parent.controls['help_popup'];oPop.sUrl=this.eElem.href;oPop.show();return false;}}
new EbaySYI3HelpPopup(this,'help_popup',c);}
this.initSOJTagging();}
ebay.oP.onAfterLoad=function()
{var p=this.parent,selCfg=p.getConfig('Selling.Categorize.Browse.Selector'),c=p.getConfig(this.sCatListConfigName),lyr=p._getControl(c.sLayerName);if(!c.aRestoreList||(c.aRestoreList&&c.aRestoreList.length==0))
this.oHelpSystem.bWaitForAjaxCall=false;var oMetaCat=p._getControl(selCfg.sSelectName);if(oMetaCat)
oMetaCat.enable(true);if(!c.bCat1Editable)
lyr.resetBrowsePanel(this.aSelectedCats[0][0]);if(c.aSelectedCategoryElems.length>1)
{var ctls=this.controls,vCat1=ctls[c.aSelectedCategoryElems[0]].getValue(),vCat2=ctls[c.aSelectedCategoryElems[1]].getValue();if(vCat1==vCat2)
ctls[c.aSelectedCategoryElems[1]].setValue('');}
var mCat=p.getQueryValue('metaCatId'),bMCat=(mCat!="");if(!selCfg.bBypassCatSelection&&bMCat)
oMetaCat.selectByValue(mCat);if(selCfg.bBypassCatSelection||bMCat)
oMetaCat._exec('onchange');var cc=ebay.oDocument.getConfig('Selling.Common');if(cc)
ebay.oP.syiCommentSubmit();}
ebay.oP.initCategories=function()
{var oD=this.parent;var cnm=this.sCatListConfigName="Selling.Categorize.Browse";var c=oD.getConfig(cnm);var cSel=oD.getConfig("Selling.Categorize.Browse.Selector");var sEs=c.aSelectedCategoryElems,aCatInputs=[],len=sEs.length;for(var i=0;i<len;i++)
aCatInputs[i]=new EbayHTMLText(this,sEs[i],false,null,true);this.isSecondary=false;this.aSelectedCats=[];this.aRestoreList=[];var aCs=this.aRestoreList=c.aRestoreList,itm,i=0;for(itm in aCs)
{this.aSelectedCats[i]=[itm,(aCs[itm][1])?aCs[itm][1]:""];i++;}
if(!c.sCatTextElemName)
c.sCatTextElemName="txtCategoryId";var oT=new EbayHTMLText(this,c.sCatTextElemName);oT.onblur=function()
{var i=((this.parent.isSecondary)?1:0);if(aCatInputs[i])
aCatInputs[i].setValue(this.getValue());}
oT.subscribeEvents("onkeypress");oT.onkeypress=function()
{var e;if(typeof(event)!="undefined")
e=event;else
e=arguments[1];var v=this.getValue();this.parent.oContinueButton.enable(v&&v.length>0,true);if(e.keyCode==13)
{oT.onblur();this.eElem.form.elements["aidZ1"].click();return false;}}
new EbayHTMLLayer(this,c.sCatBoxesLayerName);if(cSel&&cSel.sARIAMsgLyr){new EbayHTMLLayer(this,cSel.sARIAMsgLyr);}
var lyrSecondCatMsg=new EbayHTMLLayer(this,cSel.sSecondCategoryMessageElemName);new EbayHTMLLayer(this,c.sTitleLayerName);var lyr=new EbayHTMLLayer(this,c.sLayerName);lyr.sRemovedCat="";lyr.setupListeners=function(pEvent)
{this._registerListener(pEvent,this.EVENT_AFTER,"updateSelections");var fs=pEvent.parent.parent;if(this.sRemovedCat.length==0&&!this.parent.isSecondary)
{for(var itm in c.aRestoreList)
{fs.aInitList=c.aRestoreList[itm][0];break;}}}
lyr.updateSelections=function(pSourceEvent,pElem,pCarAdCat,p2ndCatAtLeaf)
{var oFilmStrip=oD._getControl(cSel.name);oFilmStrip.bPreselectCat=true;var el=pElem,oP=this.parent;var val=el.getSelectedValue();var oT=this.oDocument._getControl(c.sCatTextElemName);if(oT)
oT.setValue(val)
var s=el.getSelectedText();while(el.parent&&el.parent.parent&&el.parent.parent.objType=="EbayCategorySelectorFilmstripMember")
{el=el.parent.parent.oList;s=el.getSelectedText()+" "+s;}
oP.aSelectedCats[(oP.isSecondary)?1:0]=[val,s];oP.b2ndCatAllowedAtLeaf=p2ndCatAtLeaf;if(oP.oCarAdLyr)
{if(pCarAdCat&&!oP.isSecondary)
{oP.oCarAdLyr.show(true);oP.oCarAdDYILink.bind();oP.b2ndCatAllowed=false;oP.bCarAdCatSelected=true;}
else
{oP.oCarAdLyr.show(false);oP.bCarAdCatSelected=false;oP.b2ndCatAllowed=oD.getConfig(oP.sCatListConfigName).bCanAdd2ndCat;}}
oP.oHelpSystem.bWaitForAjaxCall=false;this.writeSelected(oP.aSelectedCats);}
lyr.writeSelected=function(pSels)
{var selector=cSel.name,p=this.parent,cnm=p.sCatListConfigName;var c=oD.getConfig(cnm),c2=oD.getConfig(selector);var oFilmStrip=oD._getControl(selector);var hSelHeadTxt=c.sSelectedCatHeadText?('<b class="g-hdn">'+c.sSelectedCatHeadText+'</b>'):"";var txt=hSelHeadTxt+c.sSelectedCatStartHTML,primCat="";var i=0,hE,nm,val;var pSelLen=pSels.length,bAddSecondCatLink=p.b2ndCatAllowed&&c.bCat1Editable&&pSelLen>0;for(var itm=0;itm<pSelLen;itm++)
{if(typeof(pSels[itm][0])=="undefined")
{i++;if(itm==0)
bAddSecondCatLink=bAddSecondCatLink&&false;continue;}
i++;bAddSecondCatLink=bAddSecondCatLink&&p.b2ndCatAllowedAtLeaf;val=pSels[itm][0];if(primCat.length==0)
primCat=val;nm=c.aSelectedCategoryElems[itm];if(nm)
{hE=oD._getControl(nm);if(hE)
hE.setValue(val);else
this.throwError("Element not found with the name '"+nm+"'","writeSelected");}
var sA="<A HREF='#' name='remove_cat_anchor_"+val+"' onclick='return ebay.oDocument._getControl(\""+this.name+"\").removeSelection(\""+
val+"\");'>"+(c.bIsRYI?c.sChangeText:c.sRemoveText)+"</A>";sB="<a href='"+c.sCompletedListingsUrl+val+"' target='_blank'>"+c.sCompletedListingsText+"</a>";var desc=pSels[itm][1];if(i>1)
desc+=c.sAdditionalText;txt+=c.sSelectedCatHTML.replaceTokens(desc,sB,sA);if(((itm==0)&&!c.bCat1Editable)||((itm==1)&&!c.bCat2Editable))
txt=txt.substring(0,txt.indexOf(c.sSelectedCatHTMLDelimiter+sA))+"<br/>";if(itm==1&&typeof(pSels[itm][0])!="undefined")
bAddSecondCatLink=false;}
var bIsPandA=oFilmStrip.bCategoryAllowsSecondCategory;var bAddMotorsParam=oFilmStrip.bSecondMetaCategoryRefresh;var sUrl="";c2.bIsMotors=(c2.bIsMotors==true);if(bAddSecondCatLink)
{sA="<span class='help'>"+c.sAdd2ndCatText+"</span>";if(c2.bIsMotors)
{if(bIsPandA&&bAddMotorsParam)
{if(!this.parent.isSecondary)
sA="<a href='#' name='cat_anchor_2nd' onclick='return ebay.oDocument._getControl(\""+this.name+"\").resetBrowsePanel(\""+primCat+"\","+(bAddMotorsParam==true)+");' >"+c.sAdd2ndCatText+"</a>";txt+=(sA+c.sAdditionalText);}}
else
{if(!this.parent.isSecondary)
sA="<a href='#' name='cat_anchor_2nd' onclick='return ebay.oDocument._getControl(\""+this.name+"\").resetBrowsePanel(\""+primCat+"\","+(c.bIsRYI?true:false)+");' >"+c.sAdd2ndCatText+"</a>";txt+=(sA+c.sAdditionalText);}}
txt+=c.sSelectedCatEndHTML;this.setValue(txt);var hsCtl=this.parent._getControl("help system");if(hsCtl)
{var addFeeHelp='addfescatlink2nd',e=this.oDocument.getUIElem(addFeeHelp);if(e)
{hsCtl.aElemsData[addFeeHelp]={'bt':null,'hp':'listing-two-categories','cf':null};e.onclick=hsCtl.loadHelpAssistant;}}
var oTitleLyr=oD._getControl(c.sTitleLayerName);if((txt!="")&&(txt!=(c.sSelectedCatStartHTML+c.sSelectedCatEndHTML)))
{this.show(true);oTitleLyr.show(true);}
else
{this.show();oTitleLyr.show();}
p.oContinueButton.enable(true,true);p.oContinueButton.eElem.setAttribute("aria-disabled",false);var catboxlyr=new EbayHTMLLayer(this,c.sCatBoxesLayerName);catboxlyr.bind();catboxlyr.focus(true);}
lyr.removeSelection=function(pId)
{var p=this.parent,cnm=p.sCatListConfigName;if(p.oCarAdLyr)
{p.oCarAdLyr.show(false);p.bCarAdCatSelected=false;}
var c=oD.getConfig(cnm);var c2=oD.getConfig(cSel.name);var oFilmStrip=oD._getControl(cSel.name);this.sRemovedCat=pId;for(var ii=0;ii<aCatInputs.length;ii++)
{if(aCatInputs[ii].getValue()==pId)
{aCatInputs[ii].setValue("");if((ii==0)&&aCatInputs[ii+1]&&(aCatInputs[ii+1].getValue()!=""))
{aCatInputs[ii].setValue(aCatInputs[ii+1].getValue());aCatInputs[ii+1].setValue("");}
break;}}
var sels=this.parent.aSelectedCats;for(var i=0;i<sels.length;i++)
{if(sels[i][0]==pId)
{var tmp="";sels[i]=[];this.parent.aSelectedCats[i]=[];if((i==0)&&sels[i+1]&&this.parent.aSelectedCats[i+1])
{sels[i]=sels[i+1];this.parent.aSelectedCats[i+1];sels[i+1]=this.parent.aSelectedCats[i+1]=[];tmp=sels[i][0];}
else if(i-1>=0&&sels[i-1][0])
tmp=sels[i-1][0];if(tmp)
this.resetBrowsePanel(tmp);break;}}
var iC=0;len=sels.length;for(i=0;i<len;i++)
{if(sels[i].length!=0)
{iC++;}}
if(!c.bCat1Editable)
this.isSecondary=true;else
{if(c.bIsRYI)
{if(this.parent.aSelectedCats[0].length==0)
this.parent.isSecondary=false;else
this.parent.isSecondary=true;}
else
this.parent.isSecondary=(iC>1);}
lyrSecondCatMsg.show(this.parent.isSecondary);this.writeSelected(this.parent.aSelectedCats);if(this.parent.aSelectedCats.length<2)
{oFilmStrip.bPreselectCat=false;}
var param="";var bCategoryExist=false;var aSelectedCats=new Array();if(c.bIsRYI)
{if(this.parent.isSecondary)
{if(c2.bIsMotors)
param="&getMotorsCoreCategories=4";else if(c2.bIsCore)
param="&getMotorsCoreCategories=1";if(param&&sels&&sels[0])
{bCategoryExist=true;if(sels[0][0])
aSelectedCats=sels[0][0];}}
else if(!this.parent.isSecondary)
{if(c2.bIsMotors)
param="&getMotorsCoreCategories=3";else if(c2.bIsCore)
{param="&getMotorsCoreCategories=2";}
if(param&&sels&&sels[1])
{bCategoryExist=true;if(sels[1][0])
aSelectedCats=sels[1][0];}}}
else if(c2.bIsMotors&&!this.parent.isSecondary)
{if(sels&&sels[1])
{bCategoryExist=true;if(sels[1][0])
aSelectedCats=sels[1][0];}
param="&getMotorsCoreCategories=3";}
if(oFilmStrip&&oFilmStrip.aMembers[0]&&oFilmStrip.aMembers[0].oLayer&&bCategoryExist)
{ebay.oP.bOverrideDataNode=true;this.parent.oEbayDataNodeStorage=new EbayDataNode(null,'Storage');this.requestData(c2.sUrl.replaceTokens(aSelectedCats)+param,aSelectedCats,oFilmStrip.aMembers[0].oLayer,oFilmStrip);}
return false;}
lyr.resetBrowsePanel=function(pPrimCat,pServerCall)
{var cnm=this.parent.sCatListConfigName;var c=oD.getConfig(cnm);var c2=oD.getConfig(cSel.name);var oT=this.oDocument._getControl(c.sCatTextElemName);if(oT)
oT.setValue("");var md=(pPrimCat.length>0)?"2":"1";this.parent.isSecondary=(md=="2");var scs=this.oDocument._getControl(cSel.name);var oFilmStrip=oD._getControl(cSel.name);var bAddMotorsParam=false;var bIsPandA=false;if(pPrimCat!="")
{bAddMotorsParam=oFilmStrip.bSecondMetaCategoryRefresh;bIsPandA=oFilmStrip.bCategoryAllowsSecondCategory;}
len=scs.aMembers.length;for(var i=0;i<len;i++)
{if(pServerCall)
{ebay.oP.bOverrideDataNode=true;this.parent.oEbayDataNodeStorage=new EbayDataNode(null,'Storage');if(c2.bIsMotors&&bIsPandA&&bAddMotorsParam)
{this.requestData(c2.sUrl.replaceTokens(pPrimCat)+"&secMetaRefresh=1",pPrimCat,scs.aMembers[i].oLayer,scs);}
else if(c2.bIsCore&&pPrimCat=="")
{this.requestData(c2.sUrl.replaceTokens(pPrimCat)+"&getMotorsCoreCategories=2",pPrimCat,scs.aMembers[i].oLayer,scs);}
else
{this.requestData(c2.sUrl.replaceTokens(pPrimCat)+"&getMotorsCoreCategories=1",pPrimCat,scs.aMembers[i].oLayer,scs);}}
scs.aMembers[i].oList.selectByIndex(0);var isiPad=navigator.userAgent.match(/iPad/i)!=null,isiPhone=navigator.userAgent.match(/iPhone/i)!=null,cnm=this.parent.sCatListConfigName,cfg=oD.getConfig(cnm);if(!(cfg.bIOSCategoryUI&&(isiPad||isiPhone))){scs.aMembers[i].oList.selectByIndex(-1);}
scs.aMembers[i].oLayer.setValue("");}
lyrSecondCatMsg.show(this.parent.isSecondary);this.writeSelected(this.parent.aSelectedCats);if(this.parent.isSecondary)
{var oSOJ=this.parent.controls['soj_tagging'];if(oSOJ)
oSOJ.registerTag({"k":"second_cat_click"});}
return false;}
lyr.requestData=function(pUrl,pName,pRequestor,pFilmStrip)
{var reqN="req_"+pName;pFilmStrip.oRequestor=pRequestor;if(pFilmStrip.aResponses[reqN])
{pFilmStrip.oRequestor.oData=this.aResponses[reqN]
pFilmStrip.oRequestor.fillValues(false);pFilmStrip.oRequestor=null;return;}
var req=ebay.oServer.createRequest(reqN,pUrl,true);req.sPostData="";req.registerAsDataListener(this);req.send();}
lyr.processDataResponse=function(pResp)
{ebay.oP.bOverrideDataNode=false;var scs=this.oDocument._getControl(cSel.name);var p=pResp.parent;if(scs.oRequestor&&p.iResponseType==p.RESPONSE_JS)
{scs.oRequestor.oData=pResp.oData;this.populateFirstCat(scs)}
else
{if(scs.onHttpError)
scs.onHttpError(pResp);scs.throwError("Invalid response. Response is not a JS type. [Response: "+encodeURIComponent(pResp.sResponseText.substr(0,100))+"...]","processDataResponse");}}
lyr.populateFirstCat=function(pFilmStrip)
{var c=pFilmStrip.oConfig;var oL=ebay.oDocument._getControl(c.sSelectName);oL.clearOptions();var oD=ebay.oP.oEbayDataNodeStorage;if(oD==null)return;var oOD=oD.aChildNodes,lyrLeft,l=oOD.length;len=pFilmStrip.aMembers.length;for(var j=0;j<len;j++)
{var oM=pFilmStrip.aMembers[j];var v,t,tmp;for(var i=0;i<l;i++)
{var aAttrib=oOD[i].aAttribs;v=oOD[i].aAttribs["id"];t=oOD[i].Name+(!aAttrib["isLeaf"].is('true')?c.sForkSign:"");oL.createOption(v,t);}
pFilmStrip.oRequestor.setValue('');lyrLeft=oM.oLayer.left();}}
lyr.onHttpError=function(pResp)
{}
var lnk=new EbayHTMLAnchor(this,c.sSwitchLinkName);lnk.onclick=function()
{var p=this.parent,expCB=p.sExpCatName,aA=p.aSelectedCats;var url=this.eElem.href;len=aA.length;for(var i=0;i<len;i++)
url+="&cat"+(i+1)+"="+aA[i][0];if(expCB)
url+='&'+expCB+'='+p.controls[expCB].isChecked();this.eElem.href=url;}}
ebay.oP.startOver=function(pConfig)
{var c=pConfig,oLyr=this.controls[c.sLayerName],aCats=c.aSelectedCategoryElems,len=aCats.length;this.aSelectedCats=[];this.isSecondary=false;for(var i=0;i<len;i++)
{var v=this.controls[aCats[i]].getValue();oLyr.removeSelection(v);oLyr.resetBrowsePanel(v);}
oLyr.eElem.firstChild.innerHTML=c.sNoCatSelectedText;this.oContinueButton.enable(false,true);this.oContinueButton.eElem.setAttribute("aria-disabled",true);}

//42@@m44

function EbaySYICatalogAutoComplete(pParent,pName,pCfg)
{var t=this,c=t.oConfig=pCfg;if(!t.objType)
t.objType="EbaySYICatalogAutoComplete";t.base=EbayBaseControl;t.base(pParent,pName);t.setRequestTimer=ebAutoCompleteSetRequestTimer;t.getResults=ebAutoCompleteGetResults;t.processToken=ebAutoCompleteProcessToken;t.processResults=ebAutoCompleteProcessResults;t.showResults=ebAutoCompleteShowResults;t.processKwToken=ebKwSuggProcessToken;t.processNewServiceKwToken=ebNewServiceKwSuggProcessToken;t.processKwResults=ebKwSuggProcessResults;t.processNewServiceKwResults=ebNewServiceKwSuggProcessResults;t.showKwResults=ebKwSuggShowResults;t.showLayer=ebShowLayer;t.resetLayers=ebAutoCompleteResetLayers;t.getRowHtml=ebAutoCompleteGetRowHtml;t.getPID=ebAutoCompleteGetPID;t.process=ebProcess;t.populateResults=ebPopulateResults;t.enableSearchBtn=ebEnableSearchBtn;t.hideYmmteLyr=ebHideYmmteLyr;t.requestData=ebAutoCompleteRequestData;t.processDataResponse=ebAutoCompleteProcessDataResponse;t.processACMetaResults=ebAutoCompleteProcessACMetaResults;t.getVehicleMetaResults=ebGetVehicleMetaResults;t.getProductMetaResults=ebGetProductMetaResults;t.getSwiftOverlay=ebGetSwiftOverlay;t.getVehiclesLnks=ebGetVehiclesLnks;t.shouldPnASurfaced=ebShouldPnASurfaced;t.results=[];t.bIsHoverACLyr=false;t.bIsHoverACSwLyr=false;t.bMetaGrouping=typeof c.sMetaUrl!='undefined';ebay.oDocument.oPage.bSwiftACOn=t.bSwiftACOn=typeof c.bSwiftACOn!='undefined';t.vMcatId='mc'+c.sVMCatId;t.pNaMcatId='mc'+'6028';t.sCurTxtVal="";t.iACVal=1;t.iTimer=c.iTimer||250;c.iNumFetchSizeKw?c.iNumFetchSizeKw:0;t.noOfRes=c.iNumFetchSizeAc+c.iNumFetchSizeKw;t.oTimer=null;t.bSplChk=false;t.splChkStr="";t.aKwArr=[];t.aAcArr=[];t.aAcVehArr=[];t.bCtr=0;t.bNewAutoService=c.bNewService;ebay.oDocument.oPage.aAcIds=[];ebay.oDocument.oPage.bAcON=c.bAcON;ebay.oDocument.oPage.bKwON=c.bKwON;ebay.oDocument.oPage.bSwift=c.bSwift;ebay.oDocument.oPage.sActClass=t.sActClass=c.sActiveClass;ebay.oDocument.oPage.sPassClass=t.sPassClass=c.sPassiveClass;t.sKwSugLyrIdPref=c.sKwResLyrIdPrefix;ebay.oDocument.oPage.oTxt=t.oTxt=new EbayHTMLText(t,c.sTxtName,false,c);ebay.oDocument.oPage.oHdnTxt=t.oHdnTxt=new EbayHTMLText(t,c.sHdnACKywd,false,c);ebay.oDocument.oPage.kwLen=t.kwLen=0;ebay.oDocument.oPage.acLen=t.acLen=0;ebay.oDocument.oPage.oLyr=t.oLyr=new EbayHTMLLayer(t,c.sLyrName,false,c);ebay.oDocument.oPage.oRes=t.oRes=new EbayHTMLLayer(t,c.sResultsName,false,c);t.oSuggLyr=new EbayHTMLLayer(t,c.sSuggLyr,false,c);t.oResSet=new EbayHTMLLayer(t,c.sResultSetName,false,c);t.oKwResSet=new EbayHTMLLayer(t,c.sKwResultSetName,false,c);t.oVertDiv=new EbayHTMLLayer(t,c.sVertDiv,false,c);t.oNav=new EbayHTMLLayer(t,c.sNavName,false,c);ebay.oDocument.oPage.oSeeMoreLnk=t.oSeeMoreLnk=new EbayHTMLAnchor(this,c.sSeeMoreProdLnk,false,c);t.oOly=new EbayHTMLLayer(t,c.sOlyId,false,c);if(!t.oOly.eElem)t.oOly.bind();var d=ebay.oDocument.doc;d.isUrlSet=false;d.sUrlSet="";d.isSeeMore=false;if(c.sARIALyrName&&c.sARIAMsg){t.oARIALyr=new EbayHTMLLayer(t,c.sARIALyrName,false,c);t.oARIAMsg=c.sARIAMsg;}
if(c.sShowBasicFlowElemName)
t.oRad=new EbayHTMLRadio(t,c.sShowBasicFlowElemName,false,c);t.oTxt._registerEvent("onkeyup","parent.setRequestTimer");t.oTxt.subscribeEvents("onpaste");t.oTxt._registerEvent("onpaste","parent.setRequestTimer");t.oLyr.subscribeEvents("onmouseover","onmouseout");t.oLyr.onmouseover=function(){this.parent.bIsHoverACLyr=true;}
t.oLyr.onmouseout=function(){this.parent.bIsHoverACLyr=false;blyrShow=true;}
t.oSeeMoreLnk.subscribeEvents("onblur");t.oSeeMoreLnk.onblur=function(){ebay.oDocument.oPage.oLyr.hide();blyrShow=false;}
t.callbackToken=null;t.rand=function(){return(new Date).getTime();}
var evtTxtBlur=t.oTxt._registerEvent("onblur");t.oLyr.hide=function()
{with(this)
if(!parent.bIsHoverACLyr){show();t.oLyr.eElem.setAttribute('aria-hidden',true);t.oTxt.eElem.setAttribute('aria-expanded',false);}}
t.oLyr._registerListener(evtTxtBlur,t.oLyr.EVENT_AFTER,"hide");if(t.oOly){t.oOly.subscribeEvents("onmouseover","onmouseout");t.oOly.onmouseover=function(){this.parent.bIsHoverACSwLyr=true;}
t.oOly.onmouseout=function(){this.parent.bIsHoverACSwLyr=false;blyrShow=true;}
t.oOly.hide=function()
{with(this)
if(!parent.bIsHoverACSwLyr){show();if(t.oOly.eElem)
t.oOly.eElem.setAttribute('aria-hidden',true);t.oTxt.eElem.setAttribute('aria-expanded',false);}}
t.oOly._registerListener(evtTxtBlur,t.oOly.EVENT_AFTER,"hide");}
t.enableSearchBtn();}
ebay.oDocument.doc.onmousedown=function(pEvent)
{var oAC=ebay.oDocument.oPage.controls["clgautocmpl"];if(oAC&&!oAC.bIsHoverACLyr){oAC.oLyr.show();oAC.oLyr.eElem.setAttribute('aria-hidden',true);oAC.oTxt.eElem.setAttribute('aria-expanded',false);blyrShow=true;}
if(oAC&&oAC.oOly.eElem&&!oAC.bIsHoverACSwLyr){oAC.oOly.show();oAC.oOly.eElem.setAttribute('aria-hidden',true);oAC.oTxt.eElem.setAttribute('aria-expanded',false);}}
ebay.oDocument.doc.onkeydown=function(pEvent){var evt=pEvent||event;oP=ebay.oDocument.oPage,oRes=oP.oRes;aRes=oP.aRes=[];if(evt.keyCode==13){if(this.isUrlSet&&!this.isSeeMore){window.location.href=this.sUrlSet;return false;}else if(this.isSeeMore){window.location.href=oP.oSeeMoreLnk.eElem.href;return false;}else{ebay.oDocument.oPage.oLyr.hide();blyrShow=false;}}
else if(evt.keyCode==38||evt.keyCode==40){if(!bKeyCode){for(var j=0;j<oP.kwLen;j++){oP.aKw[j]=new EbayHTMLAnchor(this,"kw_"+j);}
if(!oP.bSwiftACOn){for(var k=0;k<oP.acLen;k++)
oP.aAc[k]=new EbayHTMLAnchor(this,"acAnch_"+k);}
else{for(var k=0;k<oP.aAcIds.length;k++)
oP.aAc[k]=new EbayHTMLAnchor(this,oP.aAcIds[k]);}
if(oP.bAcON&&oP.bKwON){if((oP.aKw&&oP.aKw.length>0)&&(oP.aAc&&oP.aAc.length>0))
oP.aRes=oP.aKw.concat(oP.aAc);if((oP.aKw&&oP.aKw.length>0)&&(!oP.aAc))
oP.aRes=oP.aKw;if((!oP.aKw)&&(oP.aAc&&oP.aAc.length>0))
oP.aRes=oP.aAc;}else if(!oP.bAcON&&oP.bKwON){if(oP.aKw&&oP.aKw.length>0)
oP.aRes=oP.aKw;}else if(oP.bAcON&&!oP.bKwON){if(oP.aAc&&oP.aAc.length>0)
oP.aRes=oP.aAc;}}
bKeyCode=true;if(oRes.eElem.style.visibility==""){switch(evt.keyCode){case 38:ebay.oDocument.doc.previousSuggestion();break;case 40:ebay.oDocument.doc.nextSuggestion(pEvent);break;}}}}
var bNxtFlag=false,bPrevFlag=false,pValue,bKeyCode=false,blyrShow=false;ebay.oDocument.doc.nextSuggestion=function(pEvent){oP=ebay.oDocument.oPage;aRes=oP.aRes;len=aRes.length,txtVal=oP.txtVal;var iNode=-1;for(var i=0;i<(len-1);i++){if(!aRes[i].eElem||!aRes[i+1].eElem){aRes[i].bind();aRes[i+1].bind();}
if(aRes[i].getClass()==oP.sActClass){aRes[i].setClass(oP.sPassClass);aRes[i+1].setClass(oP.sActClass);iNode=i+1;oP.oTxt.eElem.setAttribute('aria-activedescendant',aRes[i+1].eElem.id);if(aRes[i+1].name.has("kw")){pValue=aRes[i+1].eElem.innerHTML;}
else if(aRes[i+1].name.has("acAnch")){pValue=aRes[i+1].eElem.childNodes[1].data;}
else{pValue=txtVal;}
bNxtFlag=true;break;}}
if(!bNxtFlag)
{if(!aRes[0].eElem)
aRes[0].bind();aRes[0].setClass(oP.sActClass);iNode=0;oP.oTxt.eElem.setAttribute('aria-activedescendant',aRes[0].eElem.id);if(aRes[0].name.has("kw")){pValue=aRes[0].eElem.innerHTML;}
else if(aRes[0].name.has("acAnch")){pValue=aRes[0].eElem.childNodes[1].data;}
else
pValue=txtVal;i=0;}
if(i==(aRes.length-1))
{aRes[i].setClass(oP.sPassClass);pValue=txtVal;bNxtFlag=false;oP.oSeeMoreLnk.setClass(oP.sActClass);document.getElementById("lnkSeeMoreProd").focus();ebay.oDocument.oPage.oLyr.show(true);this.isSeeMore=true;}
oP.oTxt.setValue(pValue);if(iNode!=len&&iNode!=-1){if(aRes[iNode].eElem){this.isUrlSet=((aRes[iNode].eElem.href!="")&&aRes[iNode].name.has("acAnch"))?true:false;this.sUrlSet=this.isUrlSet?aRes[iNode].eElem.href:"";}}
return true;}
ebay.oDocument.doc.previousSuggestion=function()
{oP=ebay.oDocument.oPage;aRes=oP.aRes;len=aRes.length,txtVal=oP.txtVal;var iNode=-1;for(var i=1;i<len;i++)
{if(!aRes[i].eElem||!aRes[i-1].eElem){aRes[i].bind();aRes[i-1].bind();}
if(aRes[i].getClass()==oP.sActClass)
{aRes[i].setClass(oP.sPassClass);aRes[i-1].setClass(oP.sActClass);iNode=i-1;oP.oTxt.eElem.setAttribute('aria-activedescendant',aRes[i-1].eElem.id);if(aRes[i-1].name.has("kw"))
pValue=aRes[i-1].eElem.innerHTML;else
pValue=txtVal;bPrevFlag=false;break;}}
if(!bPrevFlag&&pValue==txtVal)
{aRes[aRes.length-1].setClass(oP.sActClass);iNode=aRes.length-1;oP.oTxt.eElem.setAttribute('aria-activedescendant',aRes[aRes.length-1].eElem.id);if(aRes[aRes.length-1].name.has("kw"))
pValue=aRes[aRes.length-1].eElem.innerHTML;else if(aRes[aRes.length-1].name.has("acAnch"))
pValue=aRes[aRes.length-1].eElem.childNodes[1].data;else
pValue=txtVal;bPrevFlag=true;}
if(!bPrevFlag&&i==aRes.length)
{aRes[0].setClass(oP.sPassClass);pValue=txtVal;bPrevFlag=false;}
oP.oTxt.setValue(pValue);if(iNode!=len&&iNode!=-1){if(aRes[iNode].eElem){this.isUrlSet=((aRes[iNode].eElem.href!="")&&aRes[iNode].name.has("acAnch"))?true:false;this.sUrlSet=this.isUrlSet?aRes[iNode].eElem.href:"";}}
return true;}
function ebAutoCompleteSetRequestTimer(evt)
{var p=this.parent;p.enableSearchBtn();clearTimeout(p.oTimer);var key=window.event?window.event.keyCode:arguments[2]?arguments[2].keyCode:0;var sEnterKeyCode=(evt.name=='onkeyup')&&(key==13);if(!sEnterKeyCode)
p.oTimer=setTimeout(p.oUtils.controlPath(p)+'.getResults()',p.iTimer);}
function ebAutoCompleteGetResults(sugVal)
{if(!bKeyCode){var t=this,c=t.oConfig,sKeywords;t.bCtr=0;if(typeof(sugVal)!="undefined"){sKeywords=encodeURIComponent(sugVal);this.bSplChk=true;}
else
sKeywords=encodeURIComponent(t.oTxt.value());if(sKeywords==t.sCurTxtVal)
return;t.sCurTxtVal=sKeywords;ebay.oDocument.oPage.txtVal=decodeURIComponent(sKeywords);if(sKeywords!="")
{if(c.bKwON){t.cbToken2=2*t.rand();if(!t.bNewAutoService){window['jsonp'+t.cbToken2]=Function("resp","ebay.oDocument.oPage.controls['clgautocmpl'].processKwToken(resp,"+t.cbToken2+");");var sKyUrl=c.sKwAJAXUrl.replaceTokens(sKeywords)+"&callback=jsonp"+t.cbToken2;}else{var sKyUrl=c.sKwAJAXUrl.replaceTokens(sKeywords);}
t.oScript=document.createElement("script");t.oScript.setAttribute("type","text/javascript");t.oScript.setAttribute("charset","utf-8");t.oScript.setAttribute("src",sKyUrl);t.oScript.setAttribute("id","kwSOA");document.getElementsByTagName("head")[0].appendChild(t.oScript);}
if(t.bNewAutoService){try{vjo={},vjo.darwin={},vjo.darwin.domain={},vjo.darwin.domain.finding={},vjo.darwin.domain.finding.autofill={},vjo.darwin.domain.finding.autofill.AutoFill={},vjo.darwin.domain.finding.autofill.AutoFill._do=function(data){ebay.oDocument.oPage.controls['clgautocmpl'].processNewServiceKwToken(data,t.cbToken2);};}catch(error){}}
if(c.bAcON){if(t.bSwiftACOn){t.requestData(sKeywords);ebay.oDocument.oPage.aAcIds=[];t.isSeeMore=false;ebay.oDocument.oPage.oSeeMoreLnk.setClass(oP.sPassClass);}
else{t.cbToken1=t.rand();window['jsonp'+t.cbToken1]=Function("resp","ebay.oDocument.oPage.controls['clgautocmpl'].processToken(resp,"+t.cbToken1+");");var sUrl=c.sAJAXUrl+sKeywords+"&callback=jsonp"+t.cbToken1;t.oScript=document.createElement("script");t.oScript.setAttribute("type","text/javascript");t.oScript.setAttribute("charset","utf-8");t.oScript.setAttribute("src",sUrl);t.oScript.setAttribute("id","acSOA");document.getElementsByTagName("head")[0].appendChild(t.oScript);}}}
else{t.oLyr.show();t.oLyr.eElem.setAttribute('aria-hidden',true);t.oTxt.eElem.setAttribute('aria-expanded',false);}}
t.enableSearchBtn();bKeyCode=false;}
function ebAutoCompleteRequestData(sKeywords){var sUrl=this.oConfig.sACAjaxUrl+sKeywords;var req=ebay.oServer.createRequest('autocomplete_meta',sUrl,false);req.sPostData="";req.iResponseType=3;req.registerAsDataListener(this);req.send();}
function ebAutoCompleteProcessDataResponse(pResp){if(pResp&&pResp.name=="autocomplete_meta")
this.processACMetaResults(pResp.oJSON.autoCompleteResults);}
function ebAutoCompleteProcessToken(pResp1,pToken)
{if(pToken==this.cbToken1)
this.processResults(pResp1);}
function ebKwSuggProcessToken(pResp2,pToken)
{if(pToken==this.cbToken2)
this.processKwResults(pResp2);}
function ebNewServiceKwSuggProcessToken(pResp2,pToken)
{if(pToken==this.cbToken2)
this.processNewServiceKwResults(pResp2);}
function ebNewServiceKwSuggProcessResults(pResp){var oKw=this;oKw.kwResults=[];if(pResp.res&&pResp.res.sug!="0")
{var nl=pResp.res.sug.length,rr=pResp.res.sug,rl=rr.length;for(var i=0;i<rl;i++)
oKw.kwResults[oKw.kwResults.length]=rr[i];}
oKw.showKwResults(oKw.kwResults,rl);}
function ebKwSuggProcessResults(pResp)
{var oKw=this;oKw.kwResults=[];if(pResp.queryDictionaryResponse&&pResp.queryDictionaryResponse.resultSize!="0")
{var rn=pResp.queryDictionaryResponse.format.name,nl=rn.length,rr=pResp.queryDictionaryResponse.result,rl=rr.length;var idx=0,tl=rn.length;for(var t=0;t<tl;t++){if(rn[t]=="TITLE"){idx=t;break;}}
for(var i=0;i<rl;i++)
oKw.kwResults[oKw.kwResults.length]=rr[i].value;}
oKw.showKwResults(oKw.kwResults,idx);}
function ebGetProductMetaResults(qPDr){var fP,flP,rP,rlP,oAC=this;var iNameIdx=0,iEPIDIdx=0,iPIDIdx=0,iPhotoIdx=0,iMetaCatId=-1,iMetaCatName=-1,i=0,un="undefined";fP=qPDr.format.name;flP=fP.length;rP=qPDr.result;rlP=rP.length;for(i=0;i<flP;i++)
{switch(fP[i])
{case"LABEL":iNameIdx=i;break;case"EBPRODUCTID":iEPIDIdx=i;break;case"PRODUCTID":iPIDIdx=i;break;case"PHOTO":iPhotoIdx=i;break;case"METACATAGORYID":iMetaCatId=i;break;case"METACATAGORYNM":iMetaCatName=i;break;}}
var sz=(this.noOfRes<rlP)?this.noOfRes:rlP;for(i=0;i<sz;i++)
{var v=rP[i].value,dataRow={"name":typeof v[iNameIdx]!=un?v[iNameIdx]:"","epid":typeof v[iEPIDIdx]!=un?v[iEPIDIdx]:"","pid":typeof v[iPIDIdx]!=un?v[iPIDIdx]:"","pic":typeof v[iPhotoIdx]!=un?v[iPhotoIdx]:"","mcat":typeof v[iMetaCatName]!=un?v[iMetaCatName]:"","mcatId":typeof v[iMetaCatId]!=un?v[iMetaCatId]:"","acdo":(i+1)};oAC.results.length=rlP;if(!oAC.results['mc'+v[iMetaCatId]])
oAC.results['mc'+v[iMetaCatId]]=new Array();oAC.results['mc'+v[iMetaCatId]][oAC.results['mc'+v[iMetaCatId]].length]=dataRow;}}
function ebGetVehicleMetaResults(qVDr){var fV,flV,rV,rlV,oAC=this;var iNameIdx=0,iEPIDIdx=0,iPIDIdx=0,iPhotoIdx=0,iMetaCatId=-1,iMetaCatName=-1,i=0,un="undefined",iYearIdx=0,iMakeIdx=0,iModelIdx=0,iTrimIdx=0,iEngineIdx=0,iDriveTypeIdx=0;fV=qVDr.format.name;flV=fV.length;rV=qVDr.result;rlV=rV.length;for(i=0;i<flV;i++){switch(fV[i]){case"TITLE":iNameIdx=i;break;case"ePid":iEPIDIdx=i;break;case"PICTURE_URL":iPhotoIdx=i;break;case"YEAR":iYearIdx=i;break;case"MAKE":iMakeIdx=i;break;case"MODEL":iModelIdx=i;break;case"TRIM":iTrimIdx=i;break;case"ENGINE":iEngineIdx=i;break;case"DRIVE_TYPE":iDriveTypeIdx=i;break;}}
var sz=(this.noOfRes<rlV)?this.noOfRes:rlV;for(i=0;i<sz;i++){var v=rV[i].value,VDataRow={"name":typeof v[iNameIdx]!=un?v[iNameIdx]:"","epid":typeof v[iEPIDIdx]!=un?v[iEPIDIdx]:"","pic":typeof v[iPhotoIdx]!=un?v[iPhotoIdx]:"","mcatId":oAC.oConfig.sVMCatId,"year":typeof v[iYearIdx]!=un?v[iYearIdx]:"","make":typeof v[iMakeIdx]!=un?v[iMakeIdx]:"","model":typeof v[iModelIdx]!=un?v[iModelIdx]:"","trim":typeof v[iTrimIdx]!=un?v[iTrimIdx]:"","engine":typeof v[iEngineIdx]!=un?v[iEngineIdx]:"","drivetype":typeof v[iDriveTypeIdx]!=un?v[iDriveTypeIdx]:"","acdo":(i+1)};if(!oAC.results[oAC.vMcatId])oAC.results[oAC.vMcatId]=new Array();oAC.results.length+=rlV;oAC.results[oAC.vMcatId][oAC.results[oAC.vMcatId].length]=VDataRow;}}
function ebShouldPnASurfaced(qPDr,qPnADr,qVDr)
{try
{if(!qPDr||qPDr.resultSize=="0")
return true
var categoryMap={};var categoryCountToCompete=3;if(qVDr&&qVDr.resultSize!="0")
{categoryCountToCompete=2;}
var soldIndexInUSPnA=qPnADr.format.name.indexOf("SOLD");var soldIndexInUSProduct=qPDr.format.name.indexOf("SOLD");if(soldIndexInUSPnA==-1||soldIndexInUSProduct==-1)
return false;var categoryIndexNameinUSproduct=qPDr.format.name.indexOf("METACATAGORYNM");var PnAFrElSoldCOunt=parseInt(qPnADr.result[0].value[soldIndexInUSPnA]);if(!PnAFrElSoldCOunt)
{PnAFrElSoldCOunt=0;}
var count=0;for(var r=0;r<qPDr.result.length;r++)
{if(count==categoryCountToCompete)
return false;var usProductSoldCount=parseInt(qPDr.result[r].value[soldIndexInUSProduct]);if(!usProductSoldCount)
{usProductSoldCount=0;}
if(usProductSoldCount>=PnAFrElSoldCOunt)
{if((qPDr.result[r].value[categoryIndexNameinUSproduct]in categoryMap)==false)
{categoryMap[qPDr.result[r].value[categoryIndexNameinUSproduct]]=qPDr.result[r].value[soldIndexInUSProduct];count++;}}
else
{return true;}}
return true;}
catch(err)
{return false;}}
function ebAutoCompleteProcessACMetaResults(pResp){var oAC=this;oAC.results=[];if(pResp.length>1){var qPDr,qPnADr,qVDr;for(var r=0;r<pResp.length;r++)
{if(pResp[r].USProducts)
{qPDr=pResp[r].USProducts.queryDictionaryResponse;}
if(pResp[r].USVehicles)
{qVDr=pResp[r].USVehicles.queryDictionaryResponse;}
if(pResp[r].USPnA)
{qPnADr=pResp[r].USPnA.queryDictionaryResponse;}}
if(qPDr&&qPDr.resultSize!="0")
oAC.getProductMetaResults(qPDr);if(qVDr&&qVDr.resultSize!="0")
oAC.getVehicleMetaResults(qVDr);if(qPnADr&&qPnADr.resultSize!="0"&&oAC.shouldPnASurfaced(qPDr,qPnADr,qVDr))
{oAC.getProductMetaResults(qPnADr);}
oAC.showResults();}
else if(pResp.length==1){var qPD=pResp[0].USProducts;var qVD=pResp[0].USVehicles;var qPnAD=pResp[0].USPnA;if(qPD&&qPD.queryDictionaryResponse&&qPD.queryDictionaryResponse.resultSize!="0"){oAC.getProductMetaResults(qPD.queryDictionaryResponse);oAC.showResults();}
else if(qVD&&qVD.queryDictionaryResponse.resultSize!="0")
{oAC.getVehicleMetaResults(qVD.queryDictionaryResponse);oAC.showResults();}
else if(qPnAD&&qPnAD.queryDictionaryResponse&&qPnAD.queryDictionaryResponse.resultSize!="0")
{oAC.getProductMetaResults(qPnAD.queryDictionaryResponse);oAC.showResults();}}
else{var pObj=this;var sUrl=oAC.oConfig.sSTBaseUrl+this.sCurTxtVal;var req=ebay.oServer.createRequest('req_'+pObj.name,sUrl,true);req.sPostData="";req.iResponseType=3;req.registerAsDataListener(pObj);if(!pObj.processDataResponse)
eval('pObj.processDataResponse = function (pRe) {ebay.oDocument.oPage._getControl("'+this.name+'").process(pRe);}');}}
function ebAutoCompleteProcessResults(pResp)
{var oAC=this;oAC.results=[];if(pResp.queryDictionaryResponse&&pResp.queryDictionaryResponse.resultSize!="0")
{var f=pResp.queryDictionaryResponse.format.name,fl=f.length,iNameIdx=0,iEPIDIdx=0,iPIDIdx=0,iPhotoIdx=0,iMetaCatId=-1,iMetaCatName=-1;r=pResp.queryDictionaryResponse.result,rl=r.length,i=0,bMG=oAC.bMetaGrouping,un="undefined";for(i=0;i<fl;i++)
{switch(f[i])
{case"LABEL":iNameIdx=i;break;case"EBPRODUCTID":iEPIDIdx=i;break;case"PRODUCTID":iPIDIdx=i;break;case"PHOTO":iPhotoIdx=i;break;case"METACATAGORYID":iMetaCatId=i;break;case"METACATAGORYNM":iMetaCatName=i;break;}}
var sz=(this.noOfRes<rl)?this.noOfRes:rl;for(i=0;i<sz;i++)
{var v=r[i].value,dataRow={"name":typeof v[iNameIdx]!=un?v[iNameIdx]:"","epid":typeof v[iEPIDIdx]!=un?v[iEPIDIdx]:"","pid":typeof v[iPIDIdx]!=un?v[iPIDIdx]:"","pic":typeof v[iPhotoIdx]!=un?v[iPhotoIdx]:"","mcat":typeof v[iMetaCatName]!=un?v[iMetaCatName]:"","acdo":(i+1)};if(bMG)
{oAC.results.length=rl;if(!oAC.results['mc'+v[iMetaCatId]])
oAC.results['mc'+v[iMetaCatId]]=new Array();oAC.results['mc'+v[iMetaCatId]][oAC.results['mc'+v[iMetaCatId]].length]=dataRow;}
else
oAC.results[oAC.results.length]=dataRow;}
oAC.showResults();}
else{var pObj=this;var sUrl=oAC.oConfig.sSTBaseUrl+this.sCurTxtVal;var req=ebay.oServer.createRequest('req_'+pObj.name,sUrl,true);req.sPostData="";req.iResponseType=3;req.registerAsDataListener(pObj);if(!pObj.processDataResponse)
eval('pObj.processDataResponse = function (pRe) {ebay.oDocument.oPage._getControl("'+this.name+'").process(pRe);}');}}
function ebProcess(pRespData)
{if(typeof(pRespData.oJSON.SugVal)!="undefined")
this.getResults(pRespData.oJSON.SugVal);else{if(!ebay.oDocument.oPage.kwLen>0){this.oLyr.show();this.oLyr.eElem.setAttribute('aria-hidden',true);this.oTxt.eElem.setAttribute('aria-expanded',false);}
this.oNav.show();}}
function ebAutoCompleteShowResults()
{var t=this,l=t.results.length,c=t.oConfig,bData=false;t.aAcArr=[];var s="",sImg="",sProdUrl="",kwd=encodeURIComponent(t.oTxt.value()),iTopMetaCat="";t.iACVal=1;if(t.bSwiftACOn)
{var cnt=0;var cntToDisplayforCore=0;if(t.results[t.vMcatId]!=null&&t.results[t.pNaMcatId]!=null)
{cntToDisplayforCore=1}
else if(t.results[t.vMcatId]!=null||t.results[t.pNaMcatId]!=null)
{cntToDisplayforCore=2}
else
{cntToDisplayforCore=3;}
for(var i in t.results)
{bData=true;var u="";if(c.sShowBasicFlowElemName&&(t.oRad.getValue()==c.sShowBasicFlowELFlowVal))
u=c.sELMetaUrl.replaceTokens(kwd,i.substr(2));else
u=c.sMetaUrl.replaceTokens(kwd,i.substr(2));if(cnt==3)break;if(cnt==cntToDisplayforCore&&i!=t.vMcatId&&i!=t.pNaMcatId)continue;s+=c.sMetaHTML.replaceTokens(u,t.results[i][0].mcat)+t.getRowHtml(t.results[i]);if(iTopMetaCat=="")
iTopMetaCat=i.substr(2);cnt++;}}else if(t.bMetaGrouping)
{for(var i in t.results)
{bData=true;var u="";if(c.sShowBasicFlowElemName&&(t.oRad.getValue()==c.sShowBasicFlowELFlowVal))
u=c.sELMetaUrl.replaceTokens(kwd,i.substr(2));else
u=c.sMetaUrl.replaceTokens(kwd,i.substr(2));s+=c.sMetaHTML.replaceTokens(u,t.results[i][0].mcat)+t.getRowHtml(t.results[i]);if(iTopMetaCat=="")
iTopMetaCat=i.substr(2);}}
else
{bData=l>0;s+=t.getRowHtml(t.results);}
t.showLayer(bData,t.aAcArr,false);if(oP.bSwift)
t.hideYmmteLyr(c.sYmmteLyr);if(t.oNav.eElem&&t.oSeeMoreLnk.eElem)
{var smpUrl="";if(c.sShowBasicFlowElemName&&(t.oRad.getValue()==c.sShowBasicFlowELFlowVal))
smpUrl=c.sELSeeMoreProdUrl.replaceTokens(kwd,iTopMetaCat);else
smpUrl=c.sSeeMoreProdUrl.replaceTokens(kwd,iTopMetaCat);if(t.bSwiftACOn)
smpUrl+="&_trksid="+c.sSAMPClkId;t.oSeeMoreLnk.eElem.href=smpUrl;if(c.bKwON)
t.oNav.show(l>(t.noOfRes-1));else
t.oNav.show(l>(c.iNumFetchSizeAc-1));}}
function ebKwSuggShowResults(kwResults,idx)
{var t=this,c=t.oConfig,bData=true,aKw=ebay.oDocument.oPage.aKw=[];t.aKwArr=[];var oDoc=ebay.oDocument.doc;var l=t.noOfRes?t.noOfRes:c.iNumFetchSizeKw;for(var r=0;r<l;r++){if(kwResults[r]){var sugResTxt=t.bNewAutoService?kwResults[r]:kwResults[r][idx];t.aKwArr[r]='<div style="padding:5px 10px;"><a id="kw_'+r+'" style="text-decoration:none;float:none;">'+sugResTxt+'</a></div>';}}
if(t.aKwArr.length==0)bData=false;t.showLayer(bData,t.aKwArr,true);if(oP.bSwift)
t.hideYmmteLyr(c.sYmmteLyr);}
ebay.oDocument.doc.onclick=function(pEvent)
{var evt=pEvent||event;var oP=ebay.oDocument.oPage;if(ebay.oGlobals.oClient.bFirefox){if(pEvent.explicitOriginalTarget.wholeText&&pEvent.target.id.has("kw")){oP.oTxt.setValue(pEvent.explicitOriginalTarget.wholeText);oP.oHdnTxt.setValue(pEvent.explicitOriginalTarget.wholeText);oP.oLyr.show();oP.oLyr.eElem.setAttribute('aria-hidden',true);oP.oTxt.eElem.setAttribute('aria-expanded',false);}}else{if(evt&&evt.srcElement.id.has("kw")){oAnch=new EbayHTMLAnchor(this,event.srcElement.id);oAnch.bind();oP.oTxt.setValue(oAnch.eElem.innerHTML);oP.oHdnTxt.setValue(oAnch.eElem.innerHTML);oP.oLyr.show();oP.oLyr.eElem.setAttribute('aria-hidden',true);oP.oTxt.eElem.setAttribute('aria-expanded',false);}}}
function ebAutoCompleteGetRowHtml(pResults)
{var t=this,c=t.oConfig,res=pResults,l=res.length,s="",aAc=ebay.oDocument.oPage.aAc=[],mcat="",bIsVehicle=false,bIsVehiclePnA=false;var oDoc=ebay.oDocument.doc;c.sCtnHTML='<div id="<#1#>" class="wp"><a role="option" id="<#2#>" href="<#3#>"><#4#><#5#></a></div>'
aAcIds=[];if((t.oTxt.getValue()!=t.sCurTxtVal&&t.bSplChk)){s+=c.sSuggText.replaceTokens(decodeURIComponent(this.sCurTxtVal),this.oTxt.getValue());s+=c.sDividerHTML1;t.splChkStr=s;}
if(t.bSwiftACOn){var fl=res.length<3?res.length:3;for(i=0;i<fl;i++){bIsVehicle=(res[i].mcatId==c.sVMCatId)?true:false;bIsVehiclePnA=(res[i].mcatId==c.sPnAmCatId)?true:false;mcat=bIsVehicle?c.sCTMetaName:res[i].mcat;if(bIsVehicle)
sProdUrl="javascript:{}";else if(c.sShowBasicFlowElemName&&(t.oRad.getValue()==c.sShowBasicFlowELFlowVal))
sProdUrl=c.sELProductUrl.replaceTokens(t.getPID(res[i]),t.iACVal++,res[i].acdo);else
sProdUrl=c.sProductUrl.replaceTokens(t.getPID(res[i]),t.iACVal++,res[i].acdo);if(bIsVehiclePnA&&c.bPnASuggesstionEnabled)
sProdUrl=sProdUrl.replace("/ws/eBayISAPI.dll?","/ebaymotors/ws/eBayISAPI.dll?");if(c.bWithPhotos)
{if(res[i].pic!="")
sImg=c.sImgHTML.replaceTokens(res[i].pic);else
sImg=c.sImgPHHTML;var n=res[i].name.length>175?(res[i].name.substr(0,175)+"..."):res[i].name;if(i==0)
t.aAcArr.push(c.sMetaSwiftHTML.replaceTokens(mcat,c.sSeeMoreProdUrl.replaceTokens(t.oTxt.getValue(),res[i].mcatId),"ac_"+i,"acAnch_"+res[i].mcatId+i,sProdUrl,sImg,n));else
t.aAcArr.push(c.sCtnHTML.replaceTokens("ac_"+i,"acAnch_"+res[i].mcatId+i,sProdUrl,sImg,n));}else
t.aAcArr.push(c.sCtnHTML.replaceTokens("ac_"+i,"acAnch_"+res[i].mcatId+i,sProdUrl,res[i].name));if(bIsVehicle)
t.aAcVehArr[i]=res[i];var value=res[i].mcatId+i;aAcIds.push("acAnch_"+value);}}else{for(i=0;i<l;i++)
{if(c.sShowBasicFlowElemName&&(t.oRad.getValue()==c.sShowBasicFlowELFlowVal))
sProdUrl=c.sELProductUrl.replaceTokens(t.getPID(res[i]),t.iACVal++,res[i].acdo);else
sProdUrl=c.sProductUrl.replaceTokens(t.getPID(res[i]),t.iACVal++,res[i].acdo);if(c.bWithPhotos)
{if(res[i].pic!="")
sImg=c.sImgHTML.replaceTokens(res[i].pic);else
sImg=c.sImgPHHTML;var n=res[i].name.length>175?(res[i].name.substr(0,175)+"..."):res[i].name;t.aAcArr[i]=c.sCtnHTML.replaceTokens("ac_"+i,"acAnch_"+i,sProdUrl,sImg,n);}
else
t.aAcArr[i]=c.sCtnHTML.replaceTokens("ac_"+i,"acAnch_"+i,sProdUrl,res[i].name);}}
if(t.bSwiftACOn){for(var a=0;a<aAcIds.length;a++)
oP.aAcIds[oP.aAcIds.length]=aAcIds[a];}
return s;}
function ebShowLayer(bData,arr,bKw){var t=this,l1=0,l2=0,c=t.oConfig,kwStr="",acStr="";t.bCtr++;if(bData)
{if(c.bKwON&&c.bAcON){if(t.bCtr==1){if(bKw){l1=t.aKwArr.length;}else{l2=t.aAcArr.length;}}else{if(t.aAcArr.length>=c.iNumFetchSizeAc)
l1=c.iNumFetchSizeKw<=t.aKwArr.length?c.iNumFetchSizeKw:t.aKwArr.length;else
l1=(t.noOfRes-t.aAcArr.length)<=t.aKwArr.length?(t.noOfRes-t.aAcArr.length):t.aKwArr.length;if(t.aKwArr.length>=c.iNumFetchSizeKw)
l2=c.iNumFetchSizeAc<=t.aAcArr.length?c.iNumFetchSizeAc:t.aAcArr.length;else
l2=(t.noOfRes-t.aKwArr.length)<=t.aAcArr.length?(t.noOfRes-t.aKwArr.length):t.aAcArr.length;if(t.bSplChk){t.oSuggLyr.setValue(t.splChkStr);t.oSuggLyr.show(true);t.oSuggLyr.setStyle("paddingTop","15px");}else{t.oSuggLyr.setValue("");t.oSuggLyr.show();t.oSuggLyr.setStyle("paddingTop","0px");}
t.bSplChk=false;}
if(c.bKwON&&l1>0)
kwStr+=c.mtchKwHTML;if(c.bAcON&&l2>0)
acStr+=c.mtchAcHTML;for(var i=0;i<l1;i++){if(t.aKwArr[i])
kwStr+=t.aKwArr[i];}
for(var i=0;i<l2;i++){if(t.aAcArr[i])
acStr+=t.aAcArr[i];}}
else if(!c.bKwON&&c.bAcON){if(t.aAcArr.length>c.iNumFetchSizeAc)
l2=c.iNumFetchSizeAc;else
l2=t.aAcArr.length;for(var i=0;i<l2;i++){if(t.aAcArr[i])
acStr+=t.aAcArr[i];}
if(t.bSplChk){t.oSuggLyr.setValue(t.splChkStr);t.oSuggLyr.setStyle("paddingTop","15px");}else{t.oSuggLyr.setValue("");t.oSuggLyr.setStyle("paddingTop","0px");}
t.bSplChk=false;}
else if(c.bKwON&&!c.bAcON){if(t.aKwArr.length>c.iNumFetchSizeKw)
l1=c.iNumFetchSizeKw;else
l1=t.aKwArr.length;for(var i=0;i<l1;i++){if(t.aKwArr[i])
kwStr+=t.aKwArr[i];}}
ebay.oDocument.oPage.kwLen=l1;ebay.oDocument.oPage.acLen=l2;if(l2>0&&c.bAcON){t.oNav.show(true);}else
t.oNav.show(false);t.populateResults(kwStr,acStr,bKw);t.oLyr.show(true);t.oLyr.eElem.setAttribute('aria-hidden',false);t.oTxt.eElem.setAttribute('aria-expanded',true);if(t.oARIALyr&&t.oARIAMsg){t.oARIALyr.setValue(t.oARIAMsg);}
c.iNumResForScroll=c.bKwON?0:6;if((l1+l2)>c.iNumResForScroll)
{if(c.bKwON){t.oLyr.height("auto");t.oRes.height("auto");}
else{t.oLyr.height("368px");t.oRes.height("365px");}}else if((l1+l2)>0&&((l1+l2)<=c.iNumResForScroll)){t.oLyr.height(t.oResSet.height()+"px");t.oRes.height(t.oResSet.height()+"px");}
else
t.resetLayers();if(c.bKwON&&c.bAcON&&t.oVertDiv&&t.oVertDiv.eElem){if(l1>0&&l2>0){t.oLyr.setStyle("minWidth",(t.oResSet.width()+t.oKwResSet.width())+"px");t.oLyr.setStyle("maxWidth",(t.oResSet.width()+t.oKwResSet.width()+50)+"px");}else if(l1>0&&l2==0){t.oLyr.setStyle("minWidth",(t.oKwResSet.width())+"px");t.oLyr.setStyle("maxWidth",(t.oKwResSet.width()+50)+"px");}else if(l1==0&&l2>0){t.oLyr.setStyle("minWidth",(t.oResSet.width())+"px");t.oLyr.setStyle("maxWidth",(t.oResSet.width()+50)+"px");}
if(l2>l1)
t.oVertDiv.height((t.oResSet.height()+45)+"px");else
t.oVertDiv.height((t.oKwResSet.height()+10)+"px");}
if(t.bSwiftACOn)
t.getVehiclesLnks();}
else
{t.oResSet.setValue("");t.oLyr.show();t.oLyr.eElem.setAttribute('aria-hidden',true);t.oTxt.eElem.setAttribute('aria-expanded',false);t.resetLayers();}}
function ebGetVehiclesLnks(){var t=this;var i=0,oAcVeh;for(var k in t.aAcVehArr){oAcVeh=t.aAcVehArr[k];var lnk=t.oDocument.getUIElem("acAnch_"+t.aAcVehArr[k].mcatId+i);if(lnk){lnk.onclick=(function(oAcVeh){return function(){t.getSwiftOverlay(oAcVeh);return false;}})(oAcVeh);i++;}}}
function ebGetSwiftOverlay(aC){var t=this,c=t.oConfig;var y=aC.year,mk=aC.make,md=aC.model,tr=aC.trim,en=aC.engine,dt=aC.drivetype;var pic=aC.pic!=""?aC.pic:c.sNoImgUrl;var vTitle=y+" "+mk+" "+md+" "+tr+" "+en+" "+dt;t.oOly.eElem.innerHTML=c.sOlyHTML.replaceTokens(pic,vTitle,y,mk,md,tr,en,dt,aC.epid);var req=ebay.oServer.createRequest("swift_selected_product",c.sTracURL,false);req.sPostData="";req.iResponseType=3;req.registerAsDataListener(this.parent);req.send();t.oLyr.show(false);t.oOly.show(true);var oBtn=new EbayHTMLButton(t,c.sContBtn);if(!oBtn.eElem)
oBtn.bind();var oHdn=new EbayHTMLText(t,c.sAidName);if(!oHdn.eElem)
oHdn.bind();var oCpg=new EbayHTMLText(t,c.sCpgName);if(!oCpg.eElem)
oCpg.bind();var oForm=new EbayHTMLForm(t.parent,c.sFormName);if(!oForm.eElem)
oForm.bind();oBtn.onclick=function(){oHdn.setValue("true");oHdn.setValue(c.sAidValue);oCpg.setValue(c.sCpgValue);oForm.setAction(c.sFormUrl);oForm.submit();}
var oCloseLnk=new EbayHTMLAnchor(t,c.sCloseBtn);if(!oCloseLnk.eElem)oCloseLnk.bind();oCloseLnk.onclick=function(){var oSrchTxt=new EbayHTMLText(t,c.sSrchTxt);if(!oSrchTxt.eElem)oSrchTxt.bind();this.eElem.href=c.sMotorProdUrl.replaceTokens(oSrchTxt.getValue());}}
function ebPopulateResults(kwStr,acStr,bKw)
{var t=this;t.oKwResSet.eElem.innerHTML=kwStr;if(acStr!=""&&kwStr!=""){t.oKwResSet.setClass("kwSetBdr");}
else{t.oKwResSet.setClass("kwNoBdr");}
t.oResSet.eElem.innerHTML=acStr;}
function ebAutoCompleteResetLayers()
{var t=this;t.oLyr.show();t.oLyr.eElem.setAttribute('aria-hidden',true);t.oTxt.eElem.setAttribute('aria-expanded',false);}
function ebAutoCompleteGetPID(pData)
{var EPID="EPID",PID="PID",s="",t=this;s=(pData.epid!="")?EPID+pData.epid:PID+pData.pid;return s;}
function ebEnableSearchBtn(){var oSearchBtn=ebay.oP.controls[this.oConfig.sSearchBtn];if(!oSearchBtn){oSearchBtn=new EbayHTMLButton(ebay.oP,this.oConfig.sSearchBtn);oSearchBtn.bind();}
if(oSearchBtn){if(!this.oTxt.eElem)this.oTxt.bind();oSearchBtn.enable(this.oTxt.getValue().length>2);}}
function ebHideYmmteLyr(sYmmteLyr){var o=this.oDocument.getUIElem(sYmmteLyr);if(o){var oPrt=o.parentElement?o.parentElement:o.parentNode?o.parentNode:null;if(oPrt){oPrt.removeChild(o);var ctl=this.parent.controls[sYmmteLyr];if(ctl&&ctl.eElem)ctl.eElem=null;}}}

//43@@m2

ebay.oDocument.oPage.AO_ws=function()
{with(this)
{var oDoc=parent;var oCfg=oDoc.getConfig("TrackingPageNames");if(oCfg)
{var pUrl=oCfg.sPathName;if(!oDoc.createElement||!pUrl)
return;var oScript=oDoc.createElement("script");oScript.type='text/javascript';oScript.src=pUrl;var oFrag=document.getElementsByTagName("head")||document.getElementsByTagName("body");oFrag[0].appendChild(oScript);}}}

//44@@m1

function EbayHTMLSyiComments(pParent,pName,pCfg){this.base=EbayBaseControl;this.base(pParent,pName);this.oC=ebay.oP.oC=pCfg;with(this){this.oSyiCmt=new EbayHTMLAnchor(this,oC.syiComment);oSyiCmt.bind();oSyiCmt._registerEvent("onclick","parent.submitSyiForm");this.oSyiCmtFrm=new EbayHTMLForm(this,oC.syiCmdForm);oSyiCmtFrm.bind();}
this.submitSyiForm=function(){var d=document,w=h=800,p=this.parent;if(p.oSyiCmtFrm){window.open("","syiCommentsSurvey","location=0,menubar=0,status=0,resizable=1,scrollbars=1,top="+Math.round((screen.height-h)/2)+",left="+Math.round((screen.width-w)/2)+",width="+w+",height="+h);if(d.location&&d.location.protocol!="https:"){p.oSyiCmtFrm.eElem[0].value="<html>"+document.getElementsByTagName('html')[0].innerHTML+"</html>";p.oSyiCmtFrm.submit();return false;}
return true;}}}
ebay.oP.syiCommentSubmit=function(){var c=ebay.oDocument.getConfig('Selling.Common');if(c)
new EbayHTMLSyiComments(this,"syicomments",c);}

//45@@m2

var aSOJTagFields=['startSellingVin_helpLink','helpBtnlink','cntctusLnk','aidZ4','searchcatlink','browsecatlink','recentcatlink','aidZ1','remove_cat','suggestedMore','lnkStartOver'];
// b=17294892 -->