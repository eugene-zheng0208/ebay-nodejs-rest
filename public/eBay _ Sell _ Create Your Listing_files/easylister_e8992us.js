//<!--
//1@@m1

ebay.run=function(pName,pEvent)
{var ctl=this._getControl(pName);if(ctl)
{if(!ctl.eElem)
ctl.bind();ctl._exec(pEvent);}}

//2@@m1

ebay.oD=ebay.oDocument;ebay.oP=ebay.oDocument.oPage;

//3@@m6

function EbayUtilsCurrency(pParent,pName)
{if(!this.objType)
this.objType="EbayUtilsCurrency";this.base=EbayObject;this.base(pParent,pName);this.parse=function(pVal,pNonDecimal)
{var v=new String(pVal);if(pNonDecimal)
{v=v.replace(/\./g,"");v=v.replace(/,/g,".");}
v=v.replace(/,/g,"");if(isNaN(v))
return v;v=parseFloat(v);return v;}
this.round=function(pVal,pNoofDec)
{pNoofDec=pNoofDec||2;var r=Math.pow(10,pNoofDec);return Math.round(pVal*r)/r;}
this.format=function(pVal,pNonDecimal,pVATExempt)
{var iDec=(pVATExempt)?6:2;var v=new String(this.round(pVal,iDec)),dInd=v.lastIndexOf(".");if(dInd==-1)
{v+=pVATExempt?".000000":".00";}
else
{var iL=v.length-dInd-1;if(iL<iDec)
{var len=iDec-iL;for(var i=0;i<len;i++)
v+="0";}}
if(pNonDecimal)
{v=v.replace(",",".");dInd=v.lastIndexOf(".");v=v.substring(0,dInd)+","+v.substr(dInd+1);}
return v;}
this.isDecimalFormat=function(pVal)
{var sReg="^[0-9,]*[.]{1}[0-9]{1,2}";var oRegex=new RegExp(sReg,"g");return oRegex.test(pVal);}
this.toIntlFormat=function(pVal)
{var sNewVal=pVal.replace(new RegExp(",","g"),"_");sNewVal=sNewVal.replace(new RegExp("[.]","g"),",");sNewVal=sNewVal.replace(new RegExp("_","g"),".");return sNewVal;}
this.addThousandsSeparator=function(pSeparator,pVal)
{var oReg=new RegExp('(-?[0-9]+)([0-9]{3})');while(oReg.test(pVal))
pVal=pVal.replace(oReg,'$1'+pSeparator+'$2');return pVal;}}
ebay.oUtils.oCurrency=new EbayUtilsCurrency(ebay.oUtils,"Currency Functions");

//4@@m8

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

//5@@m6

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

//6@@m27

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

//7@@m11

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

//8@@m24

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

//9@@m14

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

//10@@m2

function EbayBizObject(pName)
{if(!this.objType)
this.objType="EbayBizObject";this.name=pName;this.createError=ebObjectCreateErrorWrapper;this.throwDebug=ebObjectThrowDebugWrapper;this.throwWarning=ebObjectThrowWarningWrapper;this.throwError=ebObjectThrowErrorWrapper;}

//11@@m6

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

//12@@m4

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

//13@@m11

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

//14@@m6

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

//15@@m16

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

//16@@m8

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

//17@@m7

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

//18@@m7

function EbayHTMLImage(pParent,pName,pDisabled,pSource,pDisabledSource,pCfg)
{if(!this.objType)
this.objType="EbayHTMLImage";this.base=EbayHTML;this.base(pParent,pName,pName,pDisabled,pCfg);this.sEnabledSource=this.sDisabledSource=pSource;if(pDisabledSource)
this.sDisabledSource=pDisabledSource;this.getElem=ebHTMLImageGetElem;this.source=ebHTMLImageSource;this.enableBase=this.enable;this.enable=ebHTMLImageEnable;this.subscribeEvents("onclick","onmouseover","onmouseout");}
function ebHTMLImageGetElem(pName)
{return this.getDocElem(pName,'images');}
function ebHTMLImageSource(pSrc,pText)
{var im=this.eElem;if(typeof(im)=='undefined')
return;if(typeof(pSrc)=="undefined")
return(im)?im.src:"";else
{im.src=pSrc;if(pText!=null)
im.alt=pText;}}
function ebHTMLImageEnable(pEnable)
{with(this)
{enableBase(pEnable);if(sDisabledSource&&eElem)
eElem.src=(pEnable)?sEnabledSource:sDisabledSource;}}

//19@@m12

function EbayHTMLPopup(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbayHTMLPopup";this.base=EbayBaseControl;this.base(pParent,pName);this.oConfig=pCfg||null;if(!pCfg)
{this.sUrl="";this.iWidth=this.iHeight=this.iLeft=this.iTop=null;this.bToolbar=this.bLocation=this.bStatus=this.bScrollbars=this.bResizable=this.bMenubar=true;}
else
{var u="undefined";this.sUrl=typeof(pCfg.sUrl)!=u?pCfg.sUrl:"";this.iWidth=typeof(pCfg.iWidth)!=u?pCfg.iWidth:null;this.iHeight=typeof(pCfg.iHeight)!=u?pCfg.iHeight:null;this.iLeft=typeof(pCfg.iLeft)!=u?pCfg.iLeft:null;this.iTop=typeof(pCfg.iTop)!=u?pCfg.iTop:null;this.bToolbar=typeof(pCfg.bToolbar)!=u?pCfg.bToolbar:true;this.bLocation=typeof(pCfg.bLocation)!=u?pCfg.bLocation:true;this.bStatus=typeof(pCfg.bStatus)!=u?pCfg.bStatus:true;this.bScrollbars=typeof(pCfg.bScrollbars)!=u?pCfg.bScrollbars:true;this.bResizable=typeof(pCfg.bResizable)!=u?pCfg.bResizable:true;this.bMenubar=typeof(pCfg.bMenubar)!=u?pCfg.bMenubar:true;}
this.oWin=null;this.sProps=this.sCustomProps="";this.bModal=false;this.sSavedFocusFunction=null;this.iHBuffer=this.iWBuffer=0;this.show=ebHTMLPopupShow;this.getParamString=ebHTMLGetParamString;this.modality=ebHTMLModality
this.showEx=ebHTMLPopupShowEx;this.resizeParent=ebHTMLPopupResizeParent;this.close=ebHTMLPopupClose;this.focus=ebHTMLPopupFocus;this.sizeToContent=ebHTMLPopupSizeToContent;this.clearControls=ebHTMLPopupClearControls;}
function ebHTMLPopupShow(pIsPopUnder)
{var bPopUnder=(typeof(pIsPopUnder)!="undefined"&&pIsPopUnder)?true:false;with(this)
{if(sUrl.length==0)
return null;var sP=getParamString();var oD=oDocument,tWin=oD.win;oD.setGlobalParent(this);modality(tWin);if(sUrl.has("ej2child=true")&&!sUrl.has("ej2parent="))
sUrl+="&ej2parent="+name;var w=tWin.open(sUrl,name,sP);if(bPopUnder)
w.blur();if(w&&!bPopUnder)
w.focus();oWin=w;return w;}}
function ebHTMLGetParamString()
{with(this)
{sP=(iWidth!=null)?",width="+iWidth:"";sP+=(iHeight!=null)?",height="+iHeight:"";sP+=(iLeft!=null)?",screenX="+iLeft+",left="+iLeft:"";sP+=(iTop!=null)?",screenY="+iTop+",top="+iTop:"";sP+=",toolbar="+((bToolbar)?"1":"0");sP+=",location="+((bLocation)?"1":"0");sP+=",status="+((bStatus)?"1":"0");sP+=",scrollbars="+((bScrollbars)?"1":"0");sP+=",resizable="+((bResizable)?"1":"0");sP+=",menubar="+((bMenubar)?"1":"0");sP+=",modal="+((bModal)?"1":"0");sP+=(sCustomProps.length>0)?","+sCustomProps:"";if(sP.length>0)
sP=sP.substring(1);sProps=sP;return sP;}}
function ebHTMLModality(pWin)
{if(pWin)
{with(this)
{if(bModal)
{pWin.g_ebPopupObject=this;sSavedFocusFunction=pWin.onfocus;pWin.onfocus=function()
{try
{g_ebPopupObject.focus();}
catch(e)
{}}}}}}
function ebHTMLPopupShowEx(pUrl,pWidth,pHeight,pToolbar,pLocation,pStatus,pScrollbars,pResizable,pMenubar,pLeft,pTop,pCustomsProps,pModal,pWBuffer,pHBuffer)
{with(this)
{if(pUrl)
sUrl=pUrl;iWidth=pWidth;iHeight=pHeight;iLeft=pLeft;iTop=pTop;bToolbar=pToolbar;bLocation=pLocation;bStatus=pStatus;bScrollbars=pScrollbars;bResizable=pResizable;bMenubar=pMenubar;if(pCustomsProps)
sCustomProps=pCustomsProps;bModal=pModal;iHBuffer=pHBuffer;iWBuffer=pWBuffer;return show();}}
function ebHTMLPopupResizeParent(pX,pY,pW,pH)
{var p=this.parent;if(p)
{if(!isNaN(pX)&&!isNaN(pY))
p.moveTo(pX,pY);if(!isNaN(pW)&&!isNaN(pH))
p.resizeTo(pW,pH);}}
function ebHTMLPopupClose()
{with(this)
{if(bModal)
oDocument.win.onfocus=sSavedFocusFunction;oDocument.closeWindow(oWin);}
this.clearControls();}
function ebHTMLPopupClearControls()
{this.controls=[];}
function ebHTMLPopupFocus()
{var w=this.oWin;if(w&&!w.closed)
w.focus();else
this.close();}
function ebHTMLPopupSizeToContent()
{with(this)
{var c=oGlobals.oClient;if(!(c.bNav&&(c.iVer<5)))
{var ims=oWin.document.images,len=ims.length;var bottom=0,right=0,cB,cR;for(var i=0;i<len;i++)
{cB=ims[i].offsetTop+ims[i].offsetHeight;cR=ims[i].offsetLeft+ims[i].offsetWidth;if(cB>bottom)bottom=cB;if(cR>right)right=cR;}
oWin.resizeTo(right+iWBuffer,bottom+iHBuffer);}}}

//20@@m8

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

//21@@m24

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

//22@@m1

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

//23@@m11

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

//24@@m3

function EbayClientServer()
{if(!this.objType)
this.objType="EbayClientServer";this.base=EbayBizObject;this.base("client_server");this.callDynamicScriptObject=ebClientServerCallDynamicScriptObject;this.callIframe=ebClientServerCallIframe;}
function ebClientServerCallDynamicScriptObject(pUrl)
{var oDoc=ebay.oDocument;if(!oDoc.createElement||!pUrl)
return;var oScript=oDoc.createElement("script");oScript.type='text/javascript';oScript.src=pUrl;var oFrag=document.getElementsByTagName("head")||document.getElementsByTagName("body");oFrag[0].appendChild(oScript);}
function ebClientServerCallIframe(pUrl)
{var oFrm=null,doc;var oDoc=ebay.oDocument;if(!oDoc.createElement||!pUrl)
return;var scriptstr='<scr'+'ipt src="'+pUrl+'" type="text/javascript"></scr'+'ipt>';oFrm=oDoc.createElement('iframe');oFrm.height=1;oFrm.width=1;oFrm.style.display='none';document.body.appendChild(oFrm);doc=oFrm.document||oFrm.contentDocument;doc.open();doc.write('<html><head></head><body>'+scriptstr+'</body></html>');doc.close();}
if(typeof(ebay)!="undefined")
ebay.oClientServer=new EbayClientServer();

//25@@m1

function EbayRTMFormConfig(pName)
{if(!this.objType)
this.objType="EbayRTMFormConfig";this.base=EbayConfig;this.base(pName);this.aRadioGroup=[];this.aCheckBoxGroup=[];this.aButtonGroup=[];this.sImageElem="";this.sUrl="";this.sStatusLayerElem="";}

//26@@m29

function EbayRTM(pParent,pId,pDefUrl,pW,pH,pType,pInd)
{if(!this.objType)
this.objType="EbayRTM";var sName="rtm_"+pId;sName+=pInd?pInd:"";this.base=EbayBaseControl;this.base(pParent,sName);this.name=sName;this.config=new ebRTMConfig(pParent,pId,pDefUrl,pW,pH,pType,pInd);this.writeIFrame=ebWriteRTMFrame;}
function ebRTMConfig(pParent,pId,pDefUrl,pW,pH,pType,pInd)
{var sDivName="rtm_div_"+pId;sDivName+=pInd?pInd:"";var sName="rtm_"+pId;sName+=pInd?pInd:"";this.divname=sDivName;this.base=EbayConfig;this.base(sName);this.id=pId;this.defUrl=pDefUrl;this.defAdUrl="";this.w=(pDefUrl==null?1:pW);if(this.w<=1)
this.w="100%";this.h=(pDefUrl==null?1:pH);this.type=pType||0;this.collapsed=pDefUrl==null||pW<=1||pH<=1?true:false;this.sMaxWidth=null;this.sMaxHeight=null;this.sMinWidth=null;this.sMinHeight=null;this.isDoubleClick=false;this.bReserveMax=false;this.setIFContent=ebSetIFRTMContent;this.getIFHTML=ebGetIFRTMHTML;}
function ebWriteRTMFrame()
{var cfg=this.config,f,d=this.oDocument,oGl=this.oGlobals,xsrc=oGl.oEnvironment.sPicsDir+'s.gif',oCl=oGl.oClient,width,height,un="undefined";if(this.bReserveMax)
{width=(this.sMaxWidth)?this.sMaxWidth:cfg.w;height=(this.sMaxHeight)?this.sMaxHeight:cfg.h;}
else
{if(typeof(cfg.ifWidth)!=un)
width=cfg.ifWidth;else if(cfg.sMinWidth!=null)
width=cfg.sMinWidth;else
width=cfg.w;if(typeof(cfg.ifHeight)!=un)
height=cfg.ifHeight;else if(cfg.sMinHeight!=null)
height=cfg.sMinHeight;else
height=cfg.h;}
f='<div id="'+cfg.divname+'"><img src="'+xsrc+'" height="'+height+'" width="'+width+'" border="0" alt=" "></div>';if(oCl.bMac&&oCl.bIE)
f+='<img src="'+xsrc+'" height="1" width="1" border="0" alt=" ">';d.write(f);var l=new EbayHTMLLayer(this.parent,cfg.divname);l.bind();}
function ebGetIFRTMHTML(pUrl)
{with(this)
{var width=(sMaxWidth)?sMaxWidth:w;var height=(sMaxHeight)?sMaxHeight:h;if(width=="auto"&&height=="auto")
return"";if(width=="auto")
width="100%";if(height=="auto")
height="100%";var f='<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no"'
+' id="'+name+'"'+' name="'+name+'"'+' src="'+pUrl+'"'
+' width="'+width+'" height="'+height+'"></iframe>';return f;}}
function ebSetIFRTMContent(pUrl)
{var div=ebay.oDocument._getControl(this.divname),ifUrl="",cType=0;if(div)
{var aUrlType=ebGetRTMUrlNType(pUrl);var ifUrl=aUrlType[0],cType=aUrlType[1];if(cType==0)
{if(!this.isDoubleClick&&this.sMinWidth=="0"&&this.sMinHeight=="0")
{div.setValue('');div.setStyle('display','none');return;}
if(this.w!=0&&this.h!=0&&this.sMaxWidth!="0"&&this.sMaxHeight!="0")
div.setValue(this.getIFHTML(ifUrl));else
{div.setValue('');div.setStyle('display','none');}}
else if(cType==1)
{this.type=cType;oP.controls[this.divname].setValue(ifUrl);}}}
function ebGetRTMUrlNType(pUrl)
{var retArray=new Array("",0);if(pUrl&&pUrl.indexOf('*t*')!=-1)
retArray=pUrl.split('*t*');else if(typeof(pUrl)!='undefined')
retArray[0]=pUrl;return retArray;}
function EbayRTMInfo(pParent,pId)
{if(!this.objType)
this.objType="EbayRTMInfo";this.name="rtminfo_"+pId;this.iId=pId;this.w=null;this.h=null;this.base=EbayBaseControl;this.base(pParent,this.name);this.isRtm=false;this.isDoubleClick=false;this.isDefaultPlacement=false;this.isContentPlaced=false;}

//27@@m1

String.prototype.decodeBase64=function()
{var rv=this,len=rv.length,ret="",i=0;var chr1,chr2,chr3="";var enc1,enc2,enc3,enc4="";var aChar="ABCDEFGHIJKLMNOPQRSTUVWXYZ"+"abcdefghijklmnopqrstuvwxyz"+"0123456789+/=*";var test=new RegExp("[^A-Za-z0-9+/=*]");if(test.exec(rv)){return;}
do{enc1=aChar.indexOf(rv.charAt(i++));enc2=aChar.indexOf(rv.charAt(i++));enc3=aChar.indexOf(rv.charAt(i++));enc4=aChar.indexOf(rv.charAt(i++));chr1=(enc1<<2)|(enc2>>4);chr2=((enc2&15)<<4)|(enc3>>2);chr3=((enc3&3)<<6)|enc4;ret+=String.fromCharCode(chr1);if(!(enc3>=64))
ret+=String.fromCharCode(chr2);if(!(enc4>=64))
ret+=String.fromCharCode(chr3);chr1=chr2=chr3=enc1=enc2=enc3=enc4="";}while(i<len);return ret;}
String.prototype.decodeUTF8=function()
{var s=this,len=s.length;var rs="";var i=0;var c=c1=c2=0;while(i<len)
{c=s.charCodeAt(i);if(c<128)
{rs+=String.fromCharCode(c);i++;}
else if((c>191)&&(c<224))
{c2=s.charCodeAt(i+1);rs+=String.fromCharCode(((c&31)<<6)|(c2&63));i+=2;}
else
{c2=s.charCodeAt(i+1);c3=s.charCodeAt(i+2);rs+=String.fromCharCode(((c&15)<<12)|((c2&63)<<6)|(c3&63));i+=3;}}
return rs;}

//28@@m102

ebay.oDocument.oPage.aHtmlFormCache={};ebay.oDocument.oPage.getRtmHtmlFormContent=function(pId){var aCache=ebay.oDocument.oPage.aHtmlFormCache;if(!aCache||!pId){return"";}
return aCache[pId];}
ebay.oDocument.oPage.getPopUnderContent=function(pId)
{var aCache=ebay.oDocument.oPage.aPopUnderCache;if(!aCache||!pId)
return"";var iLen=aCache.length;for(var i=0;i<iLen;i++)
{if(aCache[i].iId==pId)
return aCache[i].sContent;}}
if(typeof(oAdManager)=="undefined")
var oAdManager=new EbayAdManager();function EbayRTMPlacement(pParent,pName){var t=this;if(!t.objType)
t.objType="EbayRTMPlacement";t.base=EbayBaseControl;t.base(pParent,pName);t.srtmEngineHost="";t.aPID=new Array;t.rtms=new Array;t.rtminfos=new Array;t.bPlacementsLoaded=false;t.bOnAfterLoadExec=false;t.bDomainUnknown=false;t.register=ebRegisterRTM;t.delimiter="*t*";t.timeoutID=0;t.rdUrl="";t.sIframeName="rtm";t.bFrameNonDowngraded=false;t.appendUrl=ebAppendUrl;t.getEncodingType=ebEncodingType;t.writePlacement=ebWriteRTMPlacement;t.getRTMContent=ebGetRTMContent;t.setRTMContent=ebSetRTMContent;t.clearPlacements=ebClearRTMPlacements;t.getAdUrl=ebGetRTMAdUrl;t.getUserStr=ebGetRTMUserString;t.loadPlacements=ebLoadPlacements;t.execPageAfterLoad=ebExecPageAfterLoad;t.setRTMInlineTimeout=ebSetRTMInlineTimeout;t.WriteRTMItScriptCall=ebWriteRTMItScriptCall;t.writeInlinePlacement=ebWriteRTMInlinePlacement;t.setRTMInlineContent=ebSetRTMInlineContent;t.setLoadedDoubleClicks=ebSetLoadedDoubleClicks;t.writeContent=ebWriteContent;t.writeAllContents=ebWriteAllContents;t.writeMultipleSameContents=ebWriteMultipleSameContents;t.writeIframe=ebEbayRTMPlacementWriteIframe;t.downgradeDomain=ebRTMDowngradeDomain;t.initIframe=ebRTMPlacementInitIframe;t.initIframe();t.createRTM=ebCreateRTM;t.processRTMForm=ebEbayRTMPlacementProcessRTMForm;t.initRTMPopUnder=ebInitRTMPopUnder;t.processMerchPromo=ebProcessMerchPromo;t.loadScript=ebLoadScript;t.loadPromo=ebLoadPromo;t.bPromoStyle=t.bPromoScript=false;t.loader=t.oDocument.createElement("div");t.debug=false;t.iBodyLoadedTime=0;t.hasExp=false;t.ge=ebRTM_ge;t.toMsg=ebRTM_toMsg;t.getVal=ebRTM_getVal;t.setOverflow=ebRTM_setOverflow;t.getByClass=ebRTM_getByClass;t.hideByClass=ebRTM_hideByClass;t.err=ebRTM_err;t.onMsg=ebRTM_onMsg;t.onMsgDirs=ebRTM_onMsgDirs;t.onMsgDir=ebRTM_onMsgDir;t.onMessage=ebRTM_onMessage;t.onMsgRelay=ebRTM_onMsgRelay;t.initExpandables=ebRTM_initExpandables;t.getIndexByPID=ebRTM_getIndexByPID;var iFrm=t.oDocument.win.frames[t.sIframeName],srcUrl,pos,host;host=window.location.host;if(!(host.indexOf('cgi5.')===0||host.indexOf('ext-syi.')===0)){if(ebay.oGlobals.oClient.bFirefox&&typeof(iFrm)!='undefined'&&!t.bFrameNonDowngraded){t.downgradeDomain();}}
t.collectPids=function(){var ret="",len=t.rtms.length;if(len>0){ret="&p=";for(var i=0;i<len;i++)
ret+=t.rtms[i].id+(i<len-1?":":"");}
return ret;}
t.rdPage=function(){if(!t.rdUrl.is('')){document.location.replace(t.rdUrl);}}
t.globalAdOverlay=null;t.openReportAd=function(event,postUrl,dialogTitle,submitCaption,closeCaption,cancelCaption,adHeadlines,adTokens,reasonCodes,reasonCodeDesriptions,isIPWiredOn,startOfLayer,endOfLayer,reportAdLinkId){if(t.globalAdOverlay==null){t.globalAdOverlay=new ReportAdOverlay(dialogTitle,submitCaption,closeCaption,cancelCaption,reasonCodes,reasonCodeDesriptions,postUrl,isIPWiredOn,startOfLayer,endOfLayer,reportAdLinkId);}
if(t.globalAdOverlay!=null){t.globalAdOverlay.init(adHeadlines,adTokens);t.globalAdOverlay.open(event);t.globalAdOverlay.setReportAdLinkId(reportAdLinkId);}
document.getElementById('startOfLayer').focus();}
t.closeReportAd=function(){if(t.globalAdOverlay!=null){if(t.globalAdOverlay)
t.globalAdOverlay.close();}}
t.submitReportAd=function(){if(t.globalAdOverlay!=null){if(t.globalAdOverlay)
t.globalAdOverlay.submitReport();}}
t.addReportAdScript=function(){try{var script=document.createElement('script');script.type='text/javascript';script.src=ebay.oGlobals.oEnvironment.sJSPackagesDir+"features/rtm/report_ad.js";document.getElementsByTagName("head")[0].appendChild(script);}catch(er){}}
t.globalAdSurvey=null;t.openAdSurvey=function(messageId,event,startOfLayer,endOfLayer,closeCaption,width,pUrl){if(t.globalAdSurvey==null){t.globalAdSurvey=new AdSurvey();}
if(t.globalAdSurvey!=null){t.globalAdSurvey.loadContent(messageId,event,startOfLayer,endOfLayer,closeCaption,width,pUrl);}}
t.addAdSurveyScript=function(){try{var script=document.createElement('script');script.type='text/javascript';script.src=ebay.oGlobals.oEnvironment.sJSPackagesDir+"features/rtm/ad_survey.js";document.getElementsByTagName("head")[0].appendChild(script);}catch(er){}}}
function ebWriteRTMPlacement(pId,pAdCfg,pDefUrl,pType,pInd)
{if(document.layers)
return;var oRTM=this.createRTM(pId,pAdCfg,pDefUrl,pType,pInd);oRTM.writeIFrame();}
function ebCreateRTM(pId,pAdCfg,pDefUrl,pType,pInd)
{var c=pAdCfg||new EbayConfig(),defAdUrl='';var sMinWidth=c.ifWidth;var sMinHeight=c.ifHeight;if(c.objType.hasAny("EbayAdConfig","EbayAdTableConfig"))
defAdUrl=this.getAdUrl(c);pDefUrl=pDefUrl?pDefUrl:defAdUrl;var w=c.ifWidth||c.width;var h=c.ifHeight||c.height;w=(w=="9999")?"auto":w;h=(h=="9999")?"auto":h;var p=new EbayRTM(this,pId,pDefUrl,w,h,pType,pInd);p.config.defAdUrl=defAdUrl;p.adCfg=pAdCfg;p.config.sMaxWidth=(c.width=="9999")?"auto":c.width;p.config.sMaxHeight=(c.height=="9999")?"auto":c.height;p.config.sMinWidth=(sMinWidth=="9999")?"auto":sMinWidth;p.config.sMinHeight=(sMinHeight=="9999")?"auto":sMinHeight;if(typeof(p.adCfg.bReserveMax)!="undefined"&&p.adCfg.bReserveMax)
p.config.bReserveMax=p.adCfg.bReserveMax;this.register(p.config);return p;}
function ebGetRTMAdUrl(pCfg)
{var defAd=new EbayAd(ebay,pCfg.name,pCfg,oAdManager);defAd.setCountryGlobals=setAdCountryGlobals;defAd.setCountryLocals=setAdCountryLocals;defAd.setCountryGlobals(defAd.globals);defAd.globals.resetGlobals();defAd.setCountryLocals(defAd.config);return defAd.globals.iframeUrl+pCfg.getAdParamString(defAd.globals,defAd.ord);}
function ebSetRTMContent(pUrlArr,pSizeArr)
{var oC=this.oDocument.oPage.oConfig;if(oC.disableRTM)
return;window.clearTimeout(this.timeoutID);var aRTMs=this.rtms,un='undefined',len=aRTMs.length;if(len>0)
{for(i=0;i<len;i++)
{var isdc=(pUrlArr[i]!=-1&&pUrlArr[i].indexOf(';')==0)?true:false;if(pUrlArr[i]==-1&&!document.layers)
pUrlArr[i]=aRTMs[i].defUrl;else if(isdc)
{var sz=";sz";if(pUrlArr[i].length==1)
pUrlArr[i]=aRTMs[i].defAdUrl;else if(aRTMs[i].defAdUrl.indexOf(sz)!=-1)
pUrlArr[i]=aRTMs[i].defAdUrl.replace(sz,pUrlArr[i]+sz)}
if(!isdc&&typeof(pSizeArr[i])!=un&&pSizeArr[i]!=-1)
{if(pSizeArr[i].indexOf(":")!=-1)
{var rSize=pSizeArr[i].split(":");aRTMs[i].w=(rSize[0]==-1)?"auto":rSize[0];aRTMs[i].h=(rSize[1]==-1)?"auto":rSize[1];}}
aRTMs[i].setIFContent(pUrlArr[i]+'');}}}
function ebClearRTMPlacements()
{with(this)
{var len=rtms.length;if(len>0&&!document.layers)
for(var i=0;i<len;i++)
rtms[i].setIFContent('*t*1');}}
function ebGetRTMContent(pCfg)
{if(document.layers)
return;var oC=ebay.oDocument.oPage.oConfig;if(oC.disableRTM)
{this.clearPlacements();return;}
if(pCfg)
{var path,rHost,id,u,timeout=0,un='undefined',len=this.rtms.length;if(!pCfg.rtmEngineHost)
return;if(len==0)
return;if(typeof(pCfg.timeout)!=un)
timeout=pCfg.timeout;path=pCfg.rtmEngineHost+this.collectPids();path+=(pCfg.params)?pCfg.params:"";path+=this.getUserStr(pCfg);var d=this.oDocument,g=this.oGlobals,u=this.oUtils;path+=this.appendUrl(pCfg);this.rdUrl=(typeof(pCfg.rdUrl)!=un)?pCfg.rdUrl:"";var sTimout="",timeout=1500;if(!this.rdUrl.is("")&&timeout>0)
sTimeout="document.location.replace('"+this.rdUrl+"')";else
{var rtmArr="";for(var i=0;i<len;i++)
rtmArr+="-1,";rtmArr=(rtmArr!="")?rtmArr.substr(0,rtmArr.length-1):"";sTimeout="ebay.oDocument._getControl('rtm').setRTMContent(["+rtmArr+"],["+rtmArr+"])";}
this.timeoutID=window.setTimeout(sTimeout,timeout);d.write(u.scriptTag(path));}}
function ebAppendUrl(pCfg)
{var path="",oCJ=this.oDocument.oCookieJar;if(pCfg.rtmContextData)
path+="&c="+pCfg.rtmContextData;path+=(pCfg.params)?pCfg.params:"";if(pCfg.guid&&pCfg.guid!="")
path+="&g="+pCfg.guid;else
{var sgj=oCJ.readCookielet("ebay","sgj");if(sgj)
{path+="&g="+sgj;oCJ.writeCookielet("ebay","sgj","");}}
var oCJ=ebay.oDocument.oCookieJar,sin=oCJ.readCookielet("ebay","sin"),kms=oCJ.readCookielet("dp1","kms");if(sin.has("in")||kms.has("in"))
path+="&uf=1";else
path+="&uf=0";var oF=ebay.oDocument._getControl("flash");if(oF)
{var iFlashVersion=oF.getVersion();path+="&z="+iFlashVersion;}
path+="&ord=";if(oAdManager.randomKey)
path+=oAdManager.randomKey;else if(pCfg.ord&&pCfg.ord!="")
path+=pCfg.ord;else
{var rda=oCJ.readCookielet("ebay","rda").split('.')[0]||(new Date()).getTime();path+=rda;}
if(ebay.oGlobals.oClient.getBrowserWindowWidth)
var iWidth=ebay.oGlobals.oClient.getBrowserWindowWidth();if(iWidth)
path+='&bw='+iWidth;if(ebay.oGlobals.oClient.getBrowserWindowHeight)
var iHeight=ebay.oGlobals.oClient.getBrowserWindowHeight();if(iHeight)
path+='&bh='+iHeight;var cidCookie=oCJ.readCookielet("npii","cguid");if(cidCookie!="undefined"&&cidCookie!=""){path+='&cg='+cidCookie;}else{path+='&cg='+new Date().getTime();}
path+='&v=3';return path;}
function ebGetRTMUserString(pCfg)
{var s='',qs=document.location.search,qi=qs.indexOf("&i=."),un='undefined',oCJ=this.oDocument.oCookieJar;if(!pCfg)
return s;with(pCfg)
{if(typeof userId!=un&&userId)
s='&i='+userId;else if(qi!=-1)
{var ci=qs.indexOf(";");if(ci!=-1)
s='&i='+qs.substring(qi+3,ci);else
s='&i='+qs.substring(qi+3);}
else if(typeof login!=un&&login)
s='&l='+login;else
{var u1pc=oCJ.readCookielet("dp1","u1p"),u1pd=(u1pc)?u1pc.decodeBase64().decodeUTF8():'';if(u1pd&&!u1pd.has('@@__@@__@@'))
s='&l='+u1pd;}}
return s;}
function ebRegisterRTM(pRTM)
{if(pRTM)
{var r=this.rtms.length;this.rtms[r]=pRTM;}}
function ebEncodingType()
{var encType=null;if(typeof(_GlobalNavHeaderUtf8Encoding)!="undefined")
{encType=_GlobalNavHeaderUtf8Encoding?"UTF-8":"cp1252";}
return encType;}
function ebLoadPlacements(oC)
{if(document.layers)
return;if(!oC)
return;if(!oC.srtmEngineHost)
return;var oGlobalNav,len;if(typeof(_oGlobalNavRTMInfo)!="undefined")
oGlobalNav=_oGlobalNavRTMInfo;if(oGlobalNav&&oGlobalNav.aRTMPlacementData&&oGlobalNav.aRTMPlacementData.length>0)
{len=oGlobalNav.aRTMPlacementData.length;for(var i=0;i<len;i++)
{var oPlacementCfg=oGlobalNav.aRTMPlacementData[i];var sPid=oPlacementCfg.pid;oC.aPids[oC.aPids.length]=sPid;var cfg=getCustomAdConfig("",[""],"","","","","",null,null,false);var oRTM=this.createRTM(sPid,cfg,oPlacementCfg.defaultUrl);oRTM.config.divname=oPlacementCfg.htmlId;var oGlobalNavLayer=new EbayHTMLLayer(this,oRTM.config.divname);oGlobalNavLayer.bind();}}
var i=0,aP=oC.aPids;this.srtmEngineHost=oC.srtmEngineHost;this.aPID=oC.aPids;len=aP.length;for(i;i<len;i++)
{var oRTMInfo=new EbayRTMInfo(this,aP[i]);this.rtminfos[i]=oRTMInfo;}
var sRtmUrl=oC.srtmEngineHost+"&p="+aP.join(":")+this.getUserStr(oC)+this.appendUrl(oC);if(this.getEncodingType()!=null)
{sRtmUrl=sRtmUrl+"&enc="+this.getEncodingType();}
var oIfrm=eval("this.oDocument.win.frames['"+this.sIframeName+"']"),bIfrm=(typeof(oIfrm)!="undefined"&&typeof(oIfrm.document)!="unknown");var u=this.oUtils;var client=ebay.oGlobals.oClient;if(sRtmUrl.has("a=inline1"))
this.oDocument.write(u.scriptTag(sRtmUrl));else if(client.bFirefox&&bIfrm&&oIfrm)
{if(this.bFrameNonDowngraded)
oIfrm.document.open();oIfrm.document.write(u.scriptTag(sRtmUrl));}
else
{ebay.oClientServer.callDynamicScriptObject(sRtmUrl);if(typeof(_oGlobalNavRTMInfo)!="undefined")
_oGlobalNavRTMInfo.aRTMPlacementData=[];}
if(client.bFirefox&&bIfrm)
oIfrm.document.close();var sTimout="",timeout=1500;this.rdUrl=oC.rdUrl||"";if(oC.bMultipleSameIds)
this.writeAllContents=this.writeMultipleSameContents;if(!this.rdUrl.is("")&&timeout>0)
sTimeout="document.location.replace('"+this.rdUrl+"')";else
sTimeout="ebay.oDocument._getControl('rtm').setRTMInlineTimeout()";this.timeoutID=window.setTimeout(sTimeout,timeout);var oD=this.parent.oDocument,oP=oD.oPage;this._registerListener(oD._getEvent("load"),oP.EVENT_AFTER,"execPageAfterLoad");}
function ebEbayRTMPlacementProcessRTMForm(pStatusLayer)
{var oStatus=new EbayHTMLLayer(this,pStatusLayer);oStatus.bind();oStatus.show(true);return true;}
function ebSetRTMInlineTimeout()
{if(this.bOnAfterLoadExec)
{var rtmArr1=[],rtmArr2=[],s=(this.bDomainUnknown)?";":"-1",len=this.rtminfos.length;for(var i=0;i<len;i++)
{rtmArr1[i]=s;rtmArr2[i]="-1";if(this.rtminfos[i])
{if(this.rtminfos[i].sMinWidth!=0&&this.rtminfos[i].sMinHeight!=0)
rtmArr2[i]="-1";else
rtmArr2[i]="0:0";}}
var oC=this.oDocument.oPage.oConfig;oC.disableRTM=false;this.setRTMInlineContent(rtmArr1,rtmArr2);this.WriteRTMItScriptCall();}
else
{var sTimeout="ebay.oDocument._getControl('rtm').setRTMInlineTimeout()";var timeout=1500;this.timeoutID=window.setTimeout(sTimeout,timeout);this.WriteRTMItScriptCall();}}
function ebWriteRTMItScriptCall()
{var timeout=1500,rtmItUrl,randomNo;var index=this.srtmEngineHost.indexOf("&");this.srtmEngineHost=this.srtmEngineHost.substring(0,index);rtmItUrl=this.srtmEngineHost+"&p="+this.aPID.join(":")+"&ite=2"+"&to="+timeout;rtmItUrl=rtmItUrl.replace("RtmCmd","RtmIt");randomNo=Math.random();if(randomNo<0.05)
ebClientServerCallDynamicScriptObject(rtmItUrl);window.clearTimeout(this.timeoutID);}
function ebWriteRTMInlinePlacement(pId,pAdCfg,pDefUrl,pType,pInd)
{if(document.layers)
return;this.writePlacement(pId,pAdCfg,pDefUrl,pType,pInd);if(this.bPlacementsLoaded)
this.writeAllContents();}
function ebExecPageAfterLoad()
{this.bOnAfterLoadExec=true;if(this.bPlacementsLoaded)
this.writeAllContents();}
function ebWriteAllContents()
{var aRTMs=this.rtms,aRTMInfos=this.rtminfos,i=0,len=aRTMInfos.length;for(i;i<len;i++)
{if(!aRTMInfos[i].isContentPlaced)
{if(aRTMInfos[i].bIsPopUnder)
this.writeContent(aRTMs[j],aRTMInfos[i]);else
{var len2=aRTMs.length;for(var j=0;j<len2;j++)
{if(aRTMInfos[i].iId==aRTMs[j].id)
{var oDiv=this.controls[aRTMs[j].divname];if(oDiv&&oDiv.eElem)
{this.writeContent(aRTMs[j],aRTMInfos[i]);aRTMInfos[i].isContentPlaced=true;}
break;}}}}}}
function ebWriteMultipleSameContents()
{var aRTMs=this.rtms,aRTMInfos=this.rtminfos,i=0,iRILen=this.rtminfos.length,iRLen=aRTMs.length;for(i;i<iRILen;i++)
{for(var j=0;j<iRLen;j++)
{if((aRTMInfos[i].iId==aRTMs[j].id)&&!aRTMs[j].isContentPlaced)
{var oDiv=this.controls[aRTMs[j].divname];if(oDiv&&oDiv.eElem)
{this.writeContent(aRTMs[j],aRTMInfos[i]);aRTMs[j].isContentPlaced=true;}
break;}}}}
function ebWriteContent(pRTM,pRTMInfo)
{if(pRTMInfo.bIsPopUnder)
{this.initRTMPopUnder(pRTMInfo);return;}
else if(pRTMInfo.bIsHtmlForm)
{ebay.oDocument.oPage.aHtmlFormCache[pRTMInfo.iId]=pRTMInfo.sContent;var oL=this.controls[pRTM.divname];if(pRTMInfo.w&&pRTMInfo.h)
{if(pRTMInfo.h=="-1"||pRTMInfo.h==-1)
pRTMInfo.h=pRTM.h;var oLStyle=oL.eElem.style,h,w;oLStyle.height=h=(pRTMInfo.h.has('auto')||pRTMInfo.h.has('%'))?pRTMInfo.h:pRTMInfo.h+"px";oLStyle.width=w=(pRTMInfo.w.has('auto')||pRTMInfo.w.has('%'))?pRTMInfo.w:pRTMInfo.w+"px";if(h!='auto'&&w!='auto')oLStyle.overflow="hidden";}
var iframe=document.createElement("iframe");var oEnv=ebay.oDocument.oGlobals.oEnvironment;var domain=document.domain;var url="http://pages"+oEnv.sCountryDomain+"rtm/popunder.html"+"?downgradeDomainTo="+domain+"&pid="+pRTMInfo.iId+"&htmlForm=1";iframe.setAttribute("src",url);iframe.setAttribute("hspace",0);iframe.setAttribute("vspace",0);iframe.setAttribute("width","100%");iframe.setAttribute("frameBorder",0);iframe.setAttribute("scrolling","no");iframe.setAttribute("marginWidth",0);iframe.setAttribute("marginHeight",0);oL.eElem.appendChild(iframe);}
else if(pRTMInfo.isRtm)
{var oL=this.controls[pRTM.divname];if(pRTMInfo.w&&pRTMInfo.h)
{if(pRTMInfo.h=="-1"||pRTMInfo.h==-1)
pRTMInfo.h=pRTM.h;var oLStyle=oL.eElem.style,h,w;oLStyle.height=h=(pRTMInfo.h.has('auto')||pRTMInfo.h.has('%'))?pRTMInfo.h:pRTMInfo.h+"px";oLStyle.width=w=(pRTMInfo.w.has('auto')||pRTMInfo.w.has('%'))?pRTMInfo.w:pRTMInfo.w+"px";if(h!='auto'&&w!='auto'){if(pRTMInfo.expand){oLStyle.textAlign="left";}else{oLStyle.overflow="hidden";}}}
oL.setValue(pRTMInfo.sContent);}else if(pRTMInfo.isMerchPromo){var oL=this.controls[pRTM.divname];this.processMerchPromo(pRTMInfo,oL);}else
{if(pRTMInfo.w)
pRTM.w=pRTMInfo.w;if(pRTMInfo.h)
pRTM.h=pRTMInfo.h;if(pRTMInfo.isDoubleClick)
this.setLoadedDoubleClicks(pRTM,pRTMInfo);else
pRTM.setIFContent(pRTM.defUrl+'');}}
function ebSetLoadedDoubleClicks(pRTM,pRTMInfo)
{if(pRTMInfo.isDoubleClick)
pRTM.isDoubleClick=true;var sz=";sz";if(pRTMInfo.sAdContent.length==1)
pRTM.defAdUrl=pRTM.defAdUrl;else if(pRTM.defAdUrl.indexOf(sz)!=-1)
pRTM.defAdUrl=pRTM.defAdUrl.replace(sz,pRTMInfo.sAdContent+sz);pRTM.setIFContent(pRTM.defAdUrl+'');}
function ebInitRTMPopUnder(pRTMInfo)
{if(pRTMInfo.isContentPlaced)
return;pRTMInfo.isContentPlaced=true;var aCache=ebay.oDocument.oPage.aPopUnderCache=new Array();aCache[aCache.length]=pRTMInfo;var oEnv=ebay.oDocument.oGlobals.oEnvironment;var domain=document.domain;var oCfg={};oCfg.sUrl="http://pages"+oEnv.sCountryDomain+"rtm/popunder.html"+"?downgradeDomainTo="+domain+"&pid="+pRTMInfo.iId;oCfg.iWidth=pRTMInfo.w;oCfg.iHeight=pRTMInfo.h;oCfg.iLeft=null;oCfg.iTop=null;oCfg.bToolbar=false;oCfg.bLocation=false;oCfg.bStatus=false;oCfg.bScrollbars=false;oCfg.bResizable=false;oCfg.bMenubar=false;var oPopUnder=new EbayHTMLPopup(this.parent,"Advertisement",oCfg);oPopUnder.show(true);}
function ebSetRTMInlineContent(pContentArr,pSizeArr,pExpandInfoArr)
{var t=this;window.clearTimeout(t.timeoutID);var oC=t.oDocument.oPage.oConfig;if(oC.disableRTM)
return;var aRTMs=t.rtms,ads=t.rtminfos,un='undefined',i=0,reportAdScriptDropped=false,len=ads.length,hasAdSurvey=false;if(len>0)
{for(i=0;i<len;i++)
{var currContent=pContentArr[i];var bIsMerchPromo=(currContent!=-1&&currContent.errors)?true:false;var bIsPopUnder=(!bIsMerchPromo&&currContent!=-1&&pContentArr[i].indexOf(':')==0)?true:false;var isdc=(!bIsMerchPromo&&currContent!=-1&&pContentArr[i].indexOf(';')==0)?true:false;if(!reportAdScriptDropped&&currContent!=null&&currContent.indexOf("openReportAd")>0)
{reportAdScriptDropped=true;t.addReportAdScript();}
if(!hasAdSurvey&&currContent!=null&&currContent.indexOf("openAdSurvey")>0)
{hasAdSurvey=true;t.addAdSurveyScript();}
var bIsHtmlForm=(!bIsMerchPromo&&pContentArr[i]!=-1&&pContentArr[i].indexOf('~')==0)?true:false;if(pContentArr[i]==-1&&!document.layers)
{ads[i].isDefaultPlacement=true;}
else if(bIsMerchPromo)
{if(currContent.length>0)
{currContent=currContent[0];}
ads[i].promoMap=currContent.data.map;ads[i].isMerchPromo=true;}
else if(isdc)
{ads[i].isDoubleClick=true;ads[i].sAdContent=pContentArr[i];}
else if(bIsPopUnder)
{if(pContentArr[i].length>1)
{pContentArr[i]=pContentArr[i].substring(1);}
ads[i].sContent=pContentArr[i];ads[i].bIsPopUnder=true;}
else if(bIsHtmlForm)
{if(pContentArr[i].length>1)
{pContentArr[i]=pContentArr[i].substring(1);}
ads[i].sContent=pContentArr[i];ads[i].bIsHtmlForm=true;}
else
{ads[i].sContent=pContentArr[i];ads[i].isRtm=true;}
if(!isdc&&typeof(pSizeArr[i])!=un&&pSizeArr[i]!=-1)
{if(pSizeArr[i].indexOf(":")!=-1)
{var rSize=pSizeArr[i].split(":");ads[i].w=(rSize[0]==-1||rSize[0]=="9999")?"auto":rSize[0];ads[i].h=(rSize[1]==-1||rSize[1]=="9999")?"auto":rSize[1];}}
if(pExpandInfoArr)
{t.hasExp=true;var id=ads[i].iId,len2=pExpandInfoArr.length;for(var j=0;j<len2;j++)
{var ei=pExpandInfoArr[j];if(ei.id==id){ads[i].width=ads[i].w;ads[i].height=ads[i].h;ads[i].expand=ei.expand;ads[i].maxWidth=ei.maxWidth;ads[i].maxHeight=ei.maxHeight;ads[i].allowExpandOnLoad=ei.allowExpandOnLoad;ads[i].st=ei.st;}}}}}
t.bPlacementsLoaded=true;t.iBodyLoadedTime=(new Date()).getTime();t.writeAllContents();t.initExpandables();var oIfrm=t.oDocument.getUIElem(t.sIframeName);if(ebay.oGlobals.oClient.bIE&&oIfrm){oIfrm.outerHTML='';}}
function ebEbayRTMPlacementWriteIframe()
{var f='<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width="1" height="1" scrolling="no" title="" id="'+this.sIframeName+'" name="'+this.sIframeName+'" tabIndex="-1"></iframe>';var div=document.createElement('div');div.innerHTML=f;if(document.body!=null){document.body.appendChild(div);}else{this.oDocument.doc.write(f);}}
function ebRTMPlacementInitIframe()
{var oIfrm=this.oDocument.getUIElem(this.sIframeName),b=this.oDocument.oPage.oConfig.bNoRTMDowngrade;if(b||oIfrm==null||typeof(oIfrm)=="undefined"||typeof(oIfrm.document)=="unknown")
this.bFrameNonDowngraded=true;if(b==false)
this.bFrameNonDowngraded=false;if(!(this.oDocument.doc.location.toString().indexOf('https')==0))
{this.sIframeName="rtm_data_frame";if(ebay.oGlobals.oClient.bFirefox)
this.writeIframe();}}
function ebRTMDowngradeDomain()
{var oIfrm=this.oDocument.win.frames[this.sIframeName],dd=document.domain,i=dd.indexOf(".ebay."),dd=dd.substring(i+1),cl=this.oGlobals.oClient,sIfrm_downgrade_domain='<scr'+'ipt language=javascript>document.domain="'+dd+'";</scr'+'ipt>';if(cl.bOpera&&(!oIfrm||!oIfrm.document))
ebay.oDocument._getControl("rtm").downgradeDomain();else
{if(oIfrm&&oIfrm.document)
{oIfrm.document.open();oIfrm.document.write(sIfrm_downgrade_domain);}}}
function ebProcessMerchPromo(pMerchInfo,pLayer)
{var map=pMerchInfo.promoMap;for(var property in map){var match=property.match(/ME([0-9]+)(.*)/);if(match&&pLayer){this.loadPromo(map[property],pLayer);}else if(property.match("Script")&&!this.bPromoScript)
this.bPromoScript=this.loadScript(map[property]);else if(property.match("Style")&&!this.bPromoStyle){if(map[property]){this.bPromoStyle=true;}}}}
function ebLoadScript(pTxt)
{with(window){try{eval(pTxt);return true;}catch(except){}}
return false;}
function ebLoadPromo(pContent,pLayer)
{this.loader.innerHTML=this.loader.innerHTML+pContent;pLayer.setValue(this.loader.innerHTML);}
function ebRTM_ge(id){return document.getElementById(id);}
function ebRTM_toMsg(obj){var s="",i;for(i in obj){if(s.length>0){s+="|";}
s+=i+":"+obj[i];}
return s;}
function ebRTM_getVal(msg,name){var v=null,s,e;msg="|"+msg;s=msg.indexOf("|"+name+":");if(s>-1){s=s+name.length+2;e=msg.indexOf("|",s);if(e<0){e=msg.length;}
v=msg.substring(s,e);}
return v;}
function ebRTM_setOverflow(rootNode,clzName,value){var e=rootNode;while(e.parentNode){if(e.className==clzName){e.style.overflow=value;break;}
e=e.parentNode;}}
function ebRTM_getByClass(e,classNames){var es=e.getElementsByTagName("*"),a=[];var i,cl=classNames.length,c,st,p,j,l=es.length,s;for(i=0;i<cl;i++){c=classNames[i];st="(^|\\s)";if(c.charAt(0)=="*"){st="";c=c.substring(1);}
p=new RegExp(st+c+"(\\s|$)");for(j=0;j<l;j++){s=es[j];if(p.test(s.className)){a.push(s);}}}
return a;}
function ebRTM_hideByClass(id,classNames,overflowVisible){var e=this.ge(id);if(e){var es=this.getByClass(e,classNames);var i,s,l=es.length;for(i=0;i<l;i++){s=es[i].style;s.zIndex=-1;if(!overflowVisible){s.overflow="hidden";}}}}
function ebRTM_err(code){throw new Error("RTM"+code);}
function ebRTM_onMsg(topic,id,msgID,ad,msg){var t=this,s=t.bodyLoadedTime,e=(new Date()).getTime(),blackout=900;var expand=(topic=="ad.frame.expand");if(expand&&!ad.allowExpandOnLoad){if(s&&((e-s)<blackout)){t.err(301);}}
if(expand||(topic=="ad.frame.collapse")){var ifr=t.ge("rtm_iframe_"+id);var div=t.ge("rtm_html_"+id);if(!ifr){ifr=t.ge("ifrm_"+id);}
if(!div){div=t.ge("rtm_div_"+id);if(!div){div=t.ge("single_rtm_"+id);}}
var dir="",w=ad.width,h=ad.height,type=7,dirs,i;if(expand){type=6;dir=t.getVal(msg,"direction");if(!dir){t.err(302);}
dir=dir.toLowerCase();var expectedDir=ad.expand.toLowerCase();if(!ad.expand||(expectedDir.indexOf(dir)<0)){t.err(303);}
w=t.getVal(msg,"width");if(parseInt(w)>parseInt(ad.maxWidth)){t.err(304);}
h=t.getVal(msg,"height");if(parseInt(h)>parseInt(ad.maxHeight)){t.err(305);}
ad.height=ifr.height;}
if(!ifr||!div){t.err(306);}
dirs=dir.split("-");if((dirs.length<1)||(dirs.length>2)){t.err(307);}
t.onMsgDirs(dirs,expand,div,ifr,w,h);i=new Image();i.src=t.srtmEngineHost.split("?")[0]+"?RtmIt&ite="+type+"&m="+msgID+"&ord="+e;}}
function ebRTM_onMsgDirs(dirs,expand,div,ifr,width,height){var t=this,ua=navigator.userAgent,f=ifr;var ie6=(ua.indexOf("MSIE 6.")>-1);var ie7=(ua.indexOf("MSIE 7.")>-1);if(expand){f.style.zIndex=9000;div.style.textAlign="left";f.style.position="absolute";div.style.overflow="visible";t.onMsgDir(dirs[0],div,f,width,height);if(dirs.length>1){t.onMsgDir(dirs[1],div,f,width,height);}
if(ie6||ie7){var ft=t.ge("formatTabs");if(ft){ft.style.zIndex=-1;}
t.hideByClass("CentralArea",["hplnk"]);t.hideByClass("ResultSet",["pv"]);t.hideByClass("CentralArea",["*-n","*-s"]);t.hideByClass("CentralArea",["*-head","*-mid","*-foot"],true);}}else{f.style.zIndex=0;if(ie6){div.style.position="";}
f.style.position="absolute";f.style.top=null;f.style.left=null;f.width=width;f.height=height;}}
function ebRTM_onMsgDir(dir,div,f,width,height){var t=this;if(dir=="up"){div.style.zIndex=9000;div.style.position="relative";var ot=height-f.height;f.height=height;f.style.top=-ot+"px";}else if(dir=="down"){f.height=height;}else if(dir=="left"){div.style.zIndex=9000;div.style.position="relative";var ol=width-f.width;f.width=width;f.style.left=-ol+"px";}else if(dir=="right"){t.setOverflow(f,"ff-left","visible");f.width=width;}else{t.err(308);}}
function ebRTM_getIndexByPID(id)
{var t=this,len=t.rtminfos.length;for(var i=0;i<len;i++)
{if(t.rtminfos[i].iId==id)
{return i;}}}
function ebRTM_onMessage(msg,source,origin){var t=this;var topic=t.getVal(msg,"topic");var response={};response.topic=topic+".complete";try{var id=t.getVal(msg,"id");var i=id.lastIndexOf("_");if(i>-1){id=id.substring(i+1);}
var st=t.getVal(msg,"st");var msgID=t.getVal(msg,"m");if(!id||!st||!msgID){t.err(200);}
var i=t.getIndexByPID(id);if(typeof(i)!="number"){t.err(201);}
var ad=t.rtminfos[i];if(!ad){t.err(202);}
if(st!=ad.st){t.err(203);}
var ms=(new Date()).getTime(),lt=ad.lastTime,lo=ad.lastTopic;ad.lastTime=ms;ad.lastTopic=topic;if((lo==topic)&&((ms-lt)<500)){return;}
t.onMsg(topic,id,msgID,ad,msg);}catch(e){if(t.debug){throw e;}
var s=""+e;if(e.description){s=e.description;}
response.errors=s;}
if(source){msg=t.toMsg(response);if(origin){source.postMessage(msg,origin);}else{return msg;}}}
function ebRTM_onMsgRelay(e){ebay.oDocument._getControl("rtm").onMessage(e.data,e.source,e.origin);}
function ebRTM_initExpandables(){var t=this,w=window;if(!t.hasExp){return;}
if(w.postMessage){if(w.addEventListener){w.addEventListener("message",t.onMsgRelay,false);}else if(w.attachEvent){w.attachEvent("onmessage",t.onMsgRelay);}
return;}
if(!w.ActiveXObject){return;}
w["IEHandleMsg"]=function(msg){return ebay.oDocument._getControl("rtm").onMessage(msg,"x");};var vbscript="Class IEMsgWrapper\n"
+"  Public Function SendMsg(msg)\n"
+"    ret = IEHandleMsg(msg)\n"
+"    SendMsg = ret\n"
+"  End Function\n"
+"End Class\n"
+"Function IEGetWrapper()\n"
+"  Dim wrap\n"
+"  Set wrap = New IEMsgWrapper\n"
+"  Set IEGetWrapper = wrap\n"
+"End Function";try{w.execScript(vbscript,"vbscript");var wrapper=w["IEGetWrapper"](),i,ad,l=t.rtminfos.length;for(i=0;i<l;i++){var ad=t.rtminfos[i];if(ad.expand){var f=t.ge("rtm_iframe_"+ad.iId);if(!f){f=t.ge("ifrm_"+ad.iId);}
if(f){f.contentWindow.opener=wrapper;}}}}catch(e){}}
new EbayRTMPlacement(ebay.oDocument.oPage,"rtm");

//29@@m7

ebay.oDocument._getControl("rtm").writeContentShowBase=ebay.oDocument._getControl("rtm").writeContent;ebay.oDocument._getControl("rtm").writeContent=function(pRTM,pRTMInfo)
{this.writeContentShowBase(pRTM,pRTMInfo);var oRTM=this.parent._getControl("rtm_"+pRTM.id);if(oRTM&&parseInt(pRTMInfo.h)!=0&&parseInt(pRTMInfo.w)!=0&&oRTM.adCfg&&oRTM.adCfg.showIds&&oRTM.adCfg.showIds.length>0)
{var len=oRTM.adCfg.showIds.length;for(var j=0;j<len;j++)
{var o=new EbayHTML(ebay.oDocument,oRTM.adCfg.showIds[j],oRTM.adCfg.showIds[j]);o.bind();o.show(true);}}}

//30@@m1

function EbaySYI3HelpPopup(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbaySYI3HelpPopup";var c={};c.iWidth=parseInt(pCfg.iWidth);c.iHeight=parseInt(pCfg.iHeight);c.iLeft=screen.availWidth-c.iWidth;c.iTop=0;c.bToolbar=false;c.bLocation=false;c.bStatus=false;c.bScrollbars=true;c.bResizable=false;c.bMenubar=false;this.base=EbayHTMLPopup;this.base(pParent,pName,c);}

//31@@m8

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

//32@@m4

function EbaySpellCheckManager(pParent,pName,pConfig)
{if(!this.objType)
this.objType="EbaySpellCheckManager";this.base=EbayBaseControl;this.base(pParent,pName);this.correctedTexts=[];this.onAfterSpellCheckSubmit=null;this.onAfterSpellCheckCancel=null;this.startSpellChecker=null;this.setupListeners=function(pSpellCheckPage)
{with(pSpellCheckPage)
{pSpellCheckPage.oManager=this;this.SpellCheckPage=pSpellCheckPage;oSubmitBtn._registerEvent('onclick','parent.oManager.onSpellCheckSubmit');var len=c.aCloseLinks.length;for(var i=0;i<len;i++)
{var oCloseLink=_getControl(c.aCloseLinks[i]);oCloseLink._registerEvent('onclick','parent.oManager.onSpellCheckCancel');if(oCloseLink.name==c.aCloseLinks[0])
{oCloseLink.subscribeEvents("onblur");oCloseLink._registerEvent('onblur','parent.oManager.setFocusChkSpell');}}}}
this.onSpellCheckSubmit=function()
{with(this.parent)
{oSpellCheckEnv.save();var len=oSpellCheckEnv.aSpellCheckAreas.length;for(var i=0;i<len;i++)
{var sId=oSpellCheckEnv.aSpellCheckAreas[i];if(sId)
oManager.correctedTexts[sId]=_getControl(sId).getValue();}
var oRTE=oManager.parent.oRTE;if(oRTE)
{oRTE.oSpellChecker.updateHTML(oManager.correctedTexts[oSpellCheckEnv.aSpellCheckAreas[2]]);}
if(oManager.onAfterSpellCheckSubmit)
oManager.onAfterSpellCheckSubmit();}}
this.onSpellCheckCancel=function()
{var oRTE=this.parent.oManager.parent.oRTE;if(oRTE)
{oRTE.oSpellChecker.closeOverlay();}
if(this.parent.oManager.onAfterSpellCheckCancel)
this.parent.oManager.onAfterSpellCheckCancel();if(this.parent.oManager.parent)
this.parent.oManager.parent.oSelectedElem.focus(true);return false;}
this.setFocusChkSpell=function()
{var oFirstElem=pParent.controls[pConfig.sLayerElemName].eElem.firstChild;if(oFirstElem)
oFirstElem.focus(true);return false;}}

//33@@m17

ebay.oP.openDialog=function(pConfig,pUrl,pIsSuper)
{var c=pConfig,iL=0,iT=0;if(c)
{var w,h,oD=this.parent,d=oD.doc,bd=d.body,resizeW,resizeH;c.bForceReposition=true,shadowLyr='shadow_lyr';if(bd)
{w=bd.clientWidth;if(c.bIsMotors){h=bd.clientHeight+250;}
else{h=bd.clientHeight;}}
else if(d.innerWidth)
{w=d.innerWidth;h=d.innerHeight;}
else
{w=d.documentElement.clientWidth;h=d.documentElement.clientHeight;}
if(w<c.width||h<c.height)
{resizeW=w;resizeH=h;if(h<c.height)
resizeH=c.height+210;if(w<c.width)
resizeW=c.width+50;window.resizeTo(resizeW,resizeH);w=resizeW;h=resizeH;}
if(c.width>=w)
c.width=w-50;if(c.height>=h){if(screen.height<=600)
c.height=h-25;else
c.height=h-50;}
c.iWidth=c.width-35;var sContentLayer=c.sContentLayerName||'content',oL=this._getControl(c.sLayerElemName),cLyr;if(bd.style.overflow=='hidden')
{var dlgLyr=oD.getUIElem(c.sLayerElemName),dlgPrt=dlgLyr.parentElement?dlgLyr.parentElement:dlgLyr.parentNode;if(dlgPrt.id!=sContentLayer)
{var gryLyr=oD.getUIElem('lyrGrayout_sec'),progLyr=oD.getUIElem('lyrProgressIndicator_sec'),shLyr=oD.getUIElem(shadowLyr),mainLyr=oD.getUIElem(sContentLayer);dlgPrt.removeChild(dlgLyr);dlgPrt.removeChild(progLyr);mainLyr.appendChild(dlgLyr);mainLyr.appendChild(progLyr);if(shLyr)
{bd.removeChild(shLyr);mainLyr.appendChild(shLyr);}
var glPrt=gryLyr.parentElement?gryLyr.parentElement:gryLyr.parentNode;if(glPrt.id!=sContentLayer)
{glPrt.removeChild(gryLyr);mainLyr.appendChild(gryLyr);}}}
if(!oL)
{if(pUrl!="")
oL=new EbayHTMLOverlayUrl(this,c.sLayerElemName,c);else
oL=new EbayHTMLOverlayContent(this,c.sLayerElemName,c);}
else
{oL.sWidth=c.width;oL.sHeight=c.height;}
oL.bIsMotors=c.bIsMotors;oL.centerTop=this.getDialogTop;if(!pIsSuper)
{cLyr=this._getControl(sContentLayer);if(cLyr)
{if(!cLyr.eElem)
cLyr.bind();}
else
{cLyr=new EbayHTMLLayer(this,sContentLayer)
cLyr.bind();}}
if(pUrl!="")
{var oPiol=this._getControl("lyrProgressIndicator_sec");if(!oPiol)
oPiol=new EbayHTMLOverlayContent(this,"lyrProgressIndicator_sec",c);else
{oPiol.sWidth=c.width;oPiol.sHeight=c.height;}
oPiol.bIsMotors=c.bIsMotors;oPiol.centerTop=this.getDialogTop;if(cLyr)
oPiol.iTopPadding=iT;oPiol.iLeftPadding=iL;oPiol.bNoSetContent=oPiol.bForceReposition=true;oPiol.bClearValueOnClose=false;if(!oPiol.eElem)
oPiol.bind();if(oPiol.eElem)
{oPiol.width(parseInt(oL.sWidth)+4+'px');oPiol.height(parseInt(oL.sHeight)+4+'px');oPiol.display();var oShadow=this.controls[shadowLyr];if(!oShadow)
{oShadowDiv=oD.createElement('div');oShadowDiv.id=shadowLyr;var shadowPrt=oPiol.eElem.parentElement?oPiol.eElem.parentElement:oPiol.eElem.parentNode;shadowPrt.appendChild(oShadowDiv);oShadow=new EbayHTMLLayer(this,shadowLyr);oShadow.bind();}
if(!oShadow.eElem)
oShadow.bind();oShadow.width(oL.sWidth);oShadow.height(oL.sHeight);oShadow.top((oPiol.top()+7)+'px');oShadow.left((oPiol.left()+7)+'px');oShadow.show(true);}}
if(!pIsSuper)
{var gLyr=this.controls['grayout_lyr'],sw,sh;if(gLyr)
{var aPageSize=ebay.oUtils.oPositioning.getPageSize();sw=bd.style.overflow=='hidden'?cLyr.eElem.scrollWidth:aPageSize[0];sh=bd.style.overflow=='hidden'?cLyr.eElem.scrollHeight:aPageSize[1];gLyr.display(sw,sh);}}
oL.iLeftPadding=iL;oL.iTopPadding=iT;oL.bDowngradeDomain=false;oL.bForceReposition=true;oL.sUrl=pUrl;if(!oL.eElem)
oL.bind();if(oL.eElem)
{oL.display();if(oL.bIsMotors){window.scrollBy(0,-300);}
this.oDisplayedOverlay=oL;return true;}
return false;}}
ebay.oP.getDialogTop=function()
{with(this)
{bIsMotors=typeof bIsMotors!='undefined'?bIsMotors:false;var oD=oDocument,bd=oD.doc.body,winHeight=bd.clientHeight,cL=oGlobals.oClient,cLyr=oD.getUIElem('content');if(!cL.bIE)
winHeight=oD.win.innerHeight;else if(typeof(winHeight)=='undefined'&&cL.iVer>=6)
winHeight=oD.doc.documentElement.clientHeight;var s=0;if(bd.style.overflow=='hidden')
s=cLyr.scrollTop;else if(bd.scrollTop>0)
s=bd.scrollTop;else if(document.documentElement)
s=document.documentElement.scrollTop;s=bIsMotors?parseInt(s)-250:parseInt(s)+100;sTop=(parseInt(s)+iTopPadding)+'px';return s;}}

//34@@m10

function EbayRTEButton(pParent,pCommand,pName,pNormalImage,pSelectedImage,pStyleBtn)
{if(!this.objType)
this.objType="EbayRTEButton";this.bImage=pStyleBtn;this.base=pStyleBtn?EbayHTMLButton:EbayHTMLAnchor;this.base(pParent,pName);this.sCommand=pCommand;this.sNormalImage=pNormalImage;this.sSelectedImage=pSelectedImage;this.bSelected=false;this.updateSource=ebRTEUpdateSource;this.source=ebHTMLImageSource;this.onClick=ebRTEButtonOnClick;this.onMouseOver=ebRTEButtonOnMouseOver;this.onMouseOut=ebRTEButtonOnMouseOut;this.toggleSelection=ebRTEButtonToggleSelection;this.setCurrentState=ebRTEButtonSetCurrentState;this.applyCurrentSelection=ebRTEButtonApplyCurrentSelection;this.subscribeEvents("onmouseover","onmouseout","onclick","onkeydown");this._registerEvent("onclick","onClick");this._registerEvent("onkeydown","onClick");this._registerEvent("onmouseover","onMouseOver");this._registerEvent("onmouseout","onMouseOut");this.bind();}
function ebRTEUpdateSource()
{with(this)
{var oFirstChld=this.eElem.firstElementChild;if(!oFirstChld)
oFirstChld=this.eElem.firstChild;if(oFirstChld&&oFirstChld.nodeName=="IMG")
{if(bSelected)
oFirstChld.src=sSelectedImage;else
oFirstChld.src=sNormalImage;}
else
bImage?setClass(bSelected?sSelectedImage:sNormalImage):source(bSelected?sSelectedImage:sNormalImage);if(parent.updateHTMLSourceElem)
parent.updateHTMLSourceElem();}}
function ebRTEButtonOnClick(e)
{var key=window.event?window.event.keyCode:arguments[2].keyCode;if((e.name=="onkeydown"&&key==13)||(e.name=="onclick")){with(this)
{parent.applyCommand(sCommand);toggleSelection();}}}
function ebRTEButtonToggleSelection()
{with(this)
{bSelected=!bSelected;updateSource();}}
function ebRTEButtonOnMouseOver()
{with(this)
{var oFirstChld=this.eElem.firstElementChild;if(!oFirstChld)
oFirstChld=this.eElem.firstChild;if(oFirstChld&&oFirstChld.nodeName=="IMG")
oFirstChld.src=sNormalImage;else
bImage?setClass(sNormalImage):source(sNormalImage);}}
function ebRTEButtonOnMouseOut()
{this.updateSource();}
function ebRTEButtonSetCurrentState(pValue)
{with(this)
{if(pValue!=bSelected)
toggleSelection();}}
function ebRTEButtonApplyCurrentSelection()
{with(this)
{if(bSelected)
parent.applyCommand(sCommand);}}

//35@@m17

function EbayRTEFrame(pParent,pName)
{if(!this.objType)
this.objType="EbayRTEFrame";this.base=EbayHTMLFrame;this.base(pParent,pName);this.bIE=this.oGlobals.oClient.bIE;this.bSafari=this.oGlobals.oClient.bSafari;this.bIsHTMLMode=false;this.bTaggingOn=this.parent.oConfig.bTaggingOn||false;this.eWindow=this.eDocument=null;this.cleanupMemoryBase1=ebHTMLFrameCleanupMemory;this.cleanupMemory=ebRTEFrameCleanupMemory;this.onAfterDocumentLoad=ebRTEFrameOnAfterDocumentLoad;this.onBeforeDocumentUnload=ebRTEFrameOnBeforeDocumentUnload;this.setCurrentState=ebRTEFrameSetCurrentState;this.contentChanged=ebRTEFrameContentChanged;this.onFocusFrame=ebRTEFrameOnFocusFrame;this.onBlurFrame=ebRTEFrameOnBlurFrame;this.setHTML=ebRTEFrameSetHTML;this.getHTML=ebRTEFrameGetHTML;this.setDesignMode=ebRTEFrameSetDesignMode;this.addStyle=ebRTEFrameRTEAddStyle;this.oDocStyleSheet=null;with(this)
{_registerListener(oDocument._getEvent("load"),EVENT_AFTER,"onAfterDocumentLoad");_registerListener(oDocument._getEvent("unload"),EVENT_BEFORE,"onBeforeDocumentUnload");}}
function ebRTEFrameOnAfterDocumentLoad()
{with(this)
{if(!eElem)
bind();var fe=eElem,eWindow=fe.contentWindow,doc=eWindow.document;eDocument=(bIE||bSafari)?doc:fe.contentDocument;if(!this.oGlobals.oClient.bFirefox)
setDesignMode();doc.jsObj=this;eWindow.jsObj=this;if(bIE||bSafari)
{doc.onkeydown=doc.onmousedown=setCurrentState;doc.onkeyup=doc.onmouseup=contentChanged;doc.onfocus=onFocusFrame;doc.onblur=onBlurFrame;eWindow.onfocus=onFocusFrame;eWindow.onblur=onBlurFrame;}
else
{doc.addEventListener('keydown',setCurrentState,false);doc.addEventListener('mousedown',setCurrentState,false);doc.addEventListener('keyup',contentChanged,false);doc.addEventListener('mouseup',contentChanged,false);}
if(bTaggingOn&&!(bIE||bSafari))
{if(eWindow.attachEvent)
{eWindow.attachEvent('onfocus',onFocusFrame);eWindow.attachEvent('onblur',onBlurFrame);}else if(eWindow&&bSafari){eWindow.addEventListener('focus',onFocusFrame,false);eWindow.addEventListener('blur',onBlurFrame,false);}else
{eDocument.addEventListener('focus',onFocusFrame,false);eDocument.addEventListener('blur',onBlurFrame,false);}}
setTimeout(oUtils.controlPath(this.parent)+".initialize();",50);}}
function ebRTEFrameOnBeforeDocumentUnload()
{with(this)
{parent.oRTEFrame.cleanupMemory();if(bIE)
{var doc=eWindow.document;doc.onkeydown=doc.onmousedown=doc.onkeyup=doc.onmouseup=null;doc.jsObj=null;eWindow.jsObj=null;}
eWindow=eDocument=null;}}
function ebRTEFrameSetDesignMode()
{this.eWindow.document.designMode="on";}
function ebRTEFrameRTEAddStyle()
{with(this)
{if(bIE)
{var st=eDocument.body.document.createStyleSheet('style');st.addRule('body','font-family:arial,verdana;font-size: 9pt;');st.addRule('p','padding: 0px; margin: 0px;');oDocStyleSheet=st;}}}
function ebRTEFrameCleanupMemory()
{with(this)
{if(eWindow)
eWindow.jsObj=null;cleanupMemoryBase1();}}
function ebRTEFrameSetCurrentState()
{this.jsObj.parent.setCurrentState();}
function ebRTEFrameContentChanged()
{with(this.jsObj.parent)
{if(bInitialized)
{setCurrentState();if(!bSYI3Flow)
updateHTMLSourceElem();bContentModified=true;}
if(arguments&&arguments[0]&&arguments[0].shiftKey&&(arguments[0].keyCode==9)){if(this.jsObj.getElem('rteToollbarHelp_helpLink'))
this.jsObj.getElem('rteToollbarHelp_helpLink').focus();else if(this.jsObj.getElem('rte_1_spelling_img'))
this.jsObj.getElem('rte_1_spelling_img').focus();}}}
function ebRTEFrameSetHTML(pValue)
{with(this)
{eDocument.body.innerHTML=!bIsHTMLMode?pValue:parent.rteUtils.setCleanText(pValue);setDesignMode();}}
function ebRTEFrameGetHTML()
{var oBody=this.eDocument.body;if(!this.bIsHTMLMode)
return oBody.innerHTML;else
{if(this.oGlobals.oClient.bFirefox)
return(this.parent.rteUtils.getCleanText(oBody,this.parent.oRTEDiv.eElem));else
return oBody.innerText;}}
function ebRTEFrameOnFocusFrame()
{var syiObj=this.jsObj.parent;if(syiObj.oConfig.sAutoSaveAllFieldsOn)
syiObj.startAutoSaveFields();else if(syiObj.oConfig.sAutoSaveOn)
syiObj.onFocusFrame();try
{var oSOJ=ebay.oDocument.oPage.controls['soj_tagging'];if(oSOJ)
oSOJ.registerTimeIn({"k":"rte"});}catch(e){};}
function ebRTEFrameOnBlurFrame()
{var syiObj=this.jsObj.parent;if(syiObj.oConfig.sAutoSaveAllFieldsOn)
syiObj.stopAutoSaveFields();else if(syiObj.oConfig.sAutoSaveOn)
syiObj.onBlurFrame();try
{var oSOJ=ebay.oDocument.oPage.controls['soj_tagging'];if(oSOJ)
oSOJ.registerTimeOut({"k":"rte"});}catch(e){};}

//36@@m5

function EbayRTESelect(pParent,pCommand,pName)
{if(!this.objType)
this.objType="EbayRTESelect";this.base=EbayHTMLSelect;this.base(pParent,pName);this.sCommand=pCommand;this.sCurrentValue="";this.iClickCount=0;this.bindBase=this.bind;this.bind=ebRTESelectBind;this.onChange=ebRTESelectOnChange;this.onClick=ebRTESelectOnClick;this.onBlur=ebRTESelectOnBlur;this.setCurrentState=ebRTESelectSetCurrentState;this.applyCurrentSelection=ebRTESelectApplyCurrentSelection;this._registerEvent("onchange","onChange");this.subscribeEvents("onclick","onblur");this._registerEvent("onclick","onClick");this._registerEvent("onblur","onBlur");}
function ebRTESelectBind()
{this.bindBase();this.enable(true);}
function ebRTESelectOnChange()
{with(this)
{sCurrentValue=getSelectedValue();parent.applyCommand(sCommand,sCurrentValue);parent.setCurrentState();if(parent.updateHTMLSourceElem)
parent.updateHTMLSourceElem();}}
function ebRTESelectOnClick()
{with(this)
{if(parent.bIE)
{iClickCount++;if(iClickCount==2)
onChange();}}}
function ebRTESelectOnBlur()
{this.iClickCount=0;}
function ebRTESelectSetCurrentState(pValue)
{with(this)
{var lcv=pValue.toLowerCase();if(lcv!=sCurrentValue.toLowerCase())
{if(selectByValue(lcv))
onChange();}}}
function ebRTESelectApplyCurrentSelection()
{this.onChange();}

//37@@m51

function EbayRTE(pParent,pName,pConfig)
{if(!this.objType)
this.objType="EbayRTE";this.base=EbayBaseControl;this.base(pParent,pName);this.aSupportedCommands={"font-family":"FontName","font-size":"FontSize","font-color":"ForeColor","format-block":"FormatBlock","bold":"Bold","italic":"Italic","underline":"Underline","left-align":"JustifyLeft","centered":"JustifyCenter","right-align":"JustifyRight","ordered-list":"InsertOrderedList","unordered-list":"InsertUnorderedList","outdent":"Outdent","indent":"Indent","paste":"Paste","insert-image":"InsertImage","create-link":"CreateLink"};this.aHtmlExceptions=["<img","<script"];var c=this.oConfig=pConfig;this.bIE=this.oGlobals.oClient.bIE;this.oRTETabsElem=this.oRTETextElem=this.oRTELayer=this.oRTEFrame=this.oRTEDiv=this.oStdToolbar=this.oHtmlToolbar=null;this.bCheckHTMLOnSubmit=pConfig.bCheckHTMLOnSubmit||false;this.bFontsInitialized=false;this.bInitialized=false;this.bContentModified=false;this.aFontControls=[];this.isSupported=ebRTEIsSupported;this.createHTML=ebRTECreateHTML;this.createFrameHTML=ebRTECreateFrameHTML;this.createObjects=ebRTECreateObjects;this.initialize=ebRTEInitialize;this.applyCurrentSelections=ebRTEApplyCurrentSelections;this.applyCommand=ebRTEApplyCommand;this.setCurrentState=ebRTESetCurrentState;this.insertHTML=ebRTEInsertHTML;this.updateHTMLSourceElem=ebRTEUpdateHTMLSourceElem;this.getHTMLSource=ebRTEGetHTMLSource;this.updateHTML=ebRTEUpdateHTML;this.bSYI3Flow=c.bSYI3Flow||false;this.bBasic=false;if(c.sIframeID)
this.createHTML();this.getSelection=ebRTEGetSelection;this.checkHTML=ebRTECheckHTML;this.rteUtils=new EbayRTEUtils();}
function ebRTEGetSelection()
{return this.oRTEFrame.eDocument.selection.createRange().text;}
function ebRTEIsSupported()
{with(this.oGlobals.oClient)
return((bFirefox)||(bIE&&bWin&&(fVer>=5.5))||(bOpera&&bWin&&(fVer>=9.0))||(bSafari&&(fVer>=3.0)));}
function ebRTECreateHTML()
{with(this)
{if(isSupported())
{var c=oConfig,ifrId=c.sIframeID;oRTETextElem=new EbayHTMLText(this,c.sTextareaElemName);if(c.sLayerID)
{oRTELayer=new EbayHTMLLayer(this,c.sLayerID);oRTELayer.bind();}
oRTEFrame=new EbayRTEFrame(this,ifrId||this.name);oRTEDiv=new EbayHTMLLayer(this,"rteDiv_"+(ifrId||this.name));if(c.sRteTabsElemName)
{oRTETabsElem=new EbayHTMLLayer(this,c.sRteTabsElemName);oRTETabsElem.bind();}
if(c.sStdToolbarLayerId)
oStdToolbar=new EbayHTMLLayer(this,c.sStdToolbarLayerId);if(c.sHtmlToolbarLayerId)
oHtmlToolbar=new EbayHTMLLayer(this,c.sHtmlToolbarLayerId);if(!c.sLayerID||(oRTELayer.getStyle("visibility")=="hidden"))
{oRTETextElem.bind();oRTETextElem.show();if(!ifrId)
createFrameHTML();if(c.sRteTabsElemName)
oRTETabsElem.show(true);if(c.sLayerID)
oRTELayer.show(true);createObjects();}
return true;}
else
return false;}}
function ebRTECreateFrameHTML()
{var c=this.oConfig,s='<iframe id="'+this.name,iframeShorter=typeof(c.sIframeShoter)!='undefined'?c.sIframeShoter:false;s+='" frameborder="0" title="'+c.sIframeTitle;s+='"class="'+c.sIframeClassName;if(iframeShorter)
s+='"style="height:'+c.sIframeHeight+'px;';s+='" contenteditable ><html><body onkeydown="if (event.shiftKey && event.keyCode == 9) {if (parent.ebay.oDocument.getUIElem(\'rte_1_spelling_img\')) {parent.ebay.oDocument.getUIElem(\'rte_1_spelling_img\').focus();} else {parent.ebay.oDocument.getUIElem(\'stdMode\').focus();}}"></body></html></iframe><div id="rteDiv_'+(c.sIframeID||this.name)+'" style="position: absolute; width: 1px; height: 1px; left: 0px; top: 0px; visibility: hidden; overflow: hidden;"></div>';ebay.oDocument.write(s);}
function ebRTECreateObjects()
{var c=this.oConfig,btns=c.aButtons,len=btns.length,i=0,bc,bStyleBtn=typeof(c.bBtnStyle)!='undefined'?c.bBtnStyle:false;for(;i<len;i++)
{bc=btns[i];new EbayRTEButton(this,bc[0],bc[1],bc[2],bc[3],bStyleBtn);}
var sels=c.aSelectBoxes,len=sels.length,i=0,sc;for(;i<len;i++)
{sc=sels[i];new EbayRTESelect(this,sc[0],sc[1]);}
var plgs=c.aPlugins,len=plgs.length,i=0,pc,s,j;for(;i<len;i++)
{pc=plgs[i];s="new EbayRTE"+pc[0]+"(this,pc[1]";var len2=pc.length;for(j=2;j<len2;j++)
s+=",pc["+j+"]";eval(s+");");}}
function ebRTEInitialize()
{with(this)
{oRTEDiv.bind();var oTabs=controls['rteTabs'];if(oTabs)
oTabs.initializeTabs();if(!oRTEFrame.bIsHTMLMode)
{oRTEFrame.setHTML(getHTMLSource());applyCurrentSelections();}
try{oRTEFrame.eDocument.body.setAttribute('role','textbox');oRTEFrame.eDocument.body.setAttribute('aria-multiline','true');}catch(e){}
bInitialized=true;}}
function ebRTEApplyCurrentSelections()
{var cts=this.controls;for(var i in cts)
{if(cts[i].applyCurrentSelection)
cts[i].applyCurrentSelection();}}
function ebRTEApplyCommand(pCommand,pValue,pBypassUpdate)
{with(this)
{var cmd=aSupportedCommands[pCommand];if(cmd)
{try
{if(!pBypassUpdate)
oRTEFrame.eWindow.focus();oRTEFrame.eDocument.execCommand(cmd,false,pValue);if(!pBypassUpdate)
updateHTMLSourceElem();}
catch(e)
{}}}}
function ebRTESetCurrentState()
{with(this)
{var cts=controls,cmd,cSel,c,type;for(var i in cts)
{c=cts[i];cmd=c.sCommand;if(cmd)
{try
{cmd=aSupportedCommands[cmd];if(cmd&&!cmd.is("ForeColor"))
{var de=oRTEFrame.eDocument,qElem=de;cmd=c.objType.is("EbayRTEButton")?qElem.queryCommandState(cmd):qElem.queryCommandValue(cmd);if(c.setCurrentState)
c.setCurrentState(cmd);}}
catch(e)
{}}}
if(!bFontsInitialized)
{var aFonts=aFontControls,len=aFonts.length;for(var x=0;x<len;x++)
{var ctl=controls[aFonts[x]];if(!ctl.eElem)
ctl.bind();applyCommand(ctl.sCommand,ctl.getSelectedValue());}
bFontsInitialized=true;}}}
function ebRTEInsertHTML(pValue)
{with(this.oRTEFrame)
{if(bIE)
{eWindow.focus();var oS=eDocument.selection;if(oS.type=="Control")
oS.empty();var oRange=oS.createRange();if(!bIsHTMLMode)
oRange.pasteHTML(pValue);else
oRange.text=pValue;}
else
{if(!bIsHTMLMode)
{var rStr="replace_str_"+Math.round(Math.random()*100000000);parent.applyCommand("insert-image",rStr);eDocument.body.innerHTML=eDocument.body.innerHTML.replace(new RegExp("<[^<]*"+rStr+"[^>]*>"),pValue);}
else
eWindow.getSelection().getRangeAt(0).insertNode(eDocument.createTextNode(pValue));}
parent.updateHTMLSourceElem();}}
function ebRTEUpdateHTMLSourceElem()
{if(this.isSupported())
this.oRTETextElem.setValue(this.oRTEFrame.getHTML());}
function ebRTEGetHTMLSource()
{return this.oRTETextElem.getValue();}
function ebRTEUpdateHTML(pHTML)
{this.oRTEFrame.setHTML(pHTML);this.updateHTMLSourceElem();}
function ebRTECheckHTML()
{var bHasExceptions=false,oBody=this.oRTEFrame.eDocument.body,txt="",html=this.oRTEFrame.getHTML(),len=this.aHtmlExceptions.length;for(var i=0;i<len;i++)
{if(html.toLowerCase().indexOf(this.aHtmlExceptions[i])>=0)
{bHasExceptions=true;break;}}
if(!bHasExceptions)
{if(this.bBasic)
txt=this.oRTETextElem.getValue();else if(this.oRTEFrame.bIE)
txt=oBody.innerText;else
txt=oBody.textContent;var txtChk=txt.replace(/\s/g,"");if(txtChk=="")
{this.oRTEFrame.setHTML("");this.oRTETextElem.setValue("");}}}

//38@@m3

function EbayRTEUtils()
{if(!this.objType)
this.objType="EbayRTEUtils";this.leftTrim=function(pStr)
{var str=new String(pStr);return str.replace(/^\s*/,"");}
this.rightTrim=function(pStr)
{var str=new String(pStr);return str.replace(/\s*$/,"");}
this.trim=function(pStr)
{return this.leftTrim(this.rightTrim(pStr));}
this.encodeHTML=function(pStr,pFlag)
{var str=new String(pStr);if(typeof(pFlag)=="undefined")
pFlag=0;str=str.replace(/&/g,"&amp;");if(pFlag!=1)
str=str.replace(new RegExp("\"","g"),"&quot;");if(pFlag==2)
str=str.replace(new RegExp("\'","g"),"&#039;");str=str.replace(/</g,"&lt;");str=str.replace(/>/g,"&gt;");var r=new RegExp(String.fromCharCode(160),"g")
str=str.replace(r,"&nbsp;");return str;}
this.setCleanText=function(pStr)
{var sText=this.encodeHTML(this.trim(pStr));sText=sText.replace(/\r\n/g,"\n");sText=sText.replace(/\r/g,"\n");sText=sText.replace(/\n\n/g,"\n");sText=sText.replace(/\n/g,"<br />");sText=sText.replace(/(<br \/>)+/g,"<br />");return sText;}
this.getCleanText=function(pBody,pDiv)
{sStr=pBody.innerHTML;sStr=sStr.replace(/\r\n/ig,"\n");sStr=sStr.replace(/\r/ig,"\n");sStr=sStr.replace(/\n/ig," ");sStr=sStr.replace(/\n/ig," ");sStr=sStr.replace(/<br[^>]*>/ig,"\n");pDiv.innerHTML=sStr.replace(/<br[^>]*>/ig,"\n");var r=pBody.ownerDocument.createRange();r.selectNodeContents(pDiv);sStr=r.toString();sStr=sStr.replace(new RegExp(String.fromCharCode(160),"g")," ");return sStr;}}

//39@@m7

function EbayRTESelectFont(pParent,pName,pCommand)
{if(!this.objType)
this.objType="EbayRTESelectFont";this.base=EbayRTESelect;this.base(pParent,pCommand,pName);this.applyCurrentSelection=null;this.setCurrentState=null;var aFCtls=this.parent.aFontControls;aFCtls[aFCtls.length]=pName;}
function ebRTESelectFontSetCurrentState()
{with(this)
{sCurrentValue=getSelectedValue();parent.applyCommand(sCommand,sCurrentValue,true);}}

//40@@m7

function EbayRTEButtonColorPalette(pParent,pName,pNormalImage,pSelectedImage,pbBtnStyle)
{if(!this.objType)
this.objType="EbayRTEButtonColorPalette";this.base=EbayRTEButton;this.base(pParent,null,pName,pNormalImage,pSelectedImage,pbBtnStyle);this.onClick=ebRTEButtonColorPaletteOnClick;this.getPalette=ebRTEButtonGetPalette;}
function ebRTEButtonColorPaletteOnClick(e)
{var key=window.event?window.event.keyCode:arguments[2]?arguments[2].keyCode:0;if((e.name=="onkeydown"&&key==13)||(e.name=="onclick"))
{with(this)
{if(parent.oLayer&&(parent.oLayer.getStyle("visibility")==""))
{parent.toggleDisplay(false);parent.toggleRTESelects(true);return;}
var oPos=oUtils.oPositioning,offsetXY=oPos.getOffsetLeftTop(eElem),iLocX=offsetXY[0],iLocY=offsetXY[1];parent.saveRTEEnv();parent.initialize();parent.oLayer.setValue(getPalette());parent.oLayer.top(iLocY+height()+"px");parent.oLayer.left(iLocX+"px");parent.toggleDisplay(true);document.getElementById('a_tdPalette_0').focus(true);return false;}}
else if(key==9)
{this.parent.toggleDisplay(false);return;}}
function ebRTEButtonGetPalette()
{var colors=this.parent.oConfig.aColors,sHTML='',cell=null,len=colors.length;sHTML='<table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="1" style="border:1px solid #0099ff">';for(var i=0;i<len;i++)
{if((i%20)==0)
sHTML+='<tr>';if(i==len-1)
sHTML+='<td id="tdPalette_'+i+'" bgcolor="'+colors[i]+'" style="width:10px;height:10px" onclick="ebay.oDocument.oPage.selectColor(\''+colors[i]+'\')"><a href="javascript:void(0);" title="'+colors[i]+'" id="a_tdPalette_'+i+'" onfocus="document.getElementById(\'a_tdPalette_0\').focus(true);" onkeydown="if(event.keyCode==13)ebay.oDocument.oPage.selectColor(\''+colors[i]+'\')"></a></td>';else
sHTML+='<td id="tdPalette_'+i+'" bgcolor="'+colors[i]+'" style="width:10px;height:10px" onclick="ebay.oDocument.oPage.selectColor(\''+colors[i]+'\')"><a href="javascript:void(0);" title="'+colors[i]+'" id="a_tdPalette_'+i+'" onkeydown="if(event.keyCode==13)ebay.oDocument.oPage.selectColor(\''+colors[i]+'\')"></a></td>';if((i%20)==19)
sHTML+='</tr>';}
sHTML+='</table>';return sHTML;}

//41@@m7

function EbayRTEColorPaletteConfig(pName)
{if(!this.objType)
this.objType="EbayRTEColorPaletteConfig";this.base=EbayConfig;this.base(pName);this.aColors=['#FFFFFF','#EDEDED','#E4E4E4','#DADADA','#D1D1D1','#C7C7C7','#BDBDBD','#B3B3B3','#A8A8A8','#9E9E9E','#FF0010','#FFFE38','#76FF36','#00FFFF','#002CFD','#EF00FD','#FB0034','#FFF125','#00AE5F','#00B8EF','#00429A','#F30094','#939393','#878787','#7B7B7B','#6E6E6E','#626262','#535353','#444444','#343434','#202020','#000000','#FF9C86','#FFB18D','#FFC997','#FFF7A4','#D8E2A6','#B5D8A6','#91CFA6','#78D3CD','#08D6F7','#63AFDA','#709DCE','#7D8CC2','#9D90C2','#F8A1C6','#FE9EA5','#FF715C','#FF9363','#FFB26A','#FFF478','#C3D680','#96C981','#55BF84','#00C3BB','#00C7F3','#0097CE','#0080BC','#416AAD','#7E6BAF','#A66EAF','#F475AF','#FB7388','#FB0034','#FF6A35','#FF9936','#FFF125','#ADCB52','#62BC5B','#00AE5F','#00B2A6','#00B8EF','#0080C1','#0063AB','#00429A','#593C99','#923397','#F30094','#F90066','#AD001F','#B34A20','#B76B21','#C4A621','#748F3B','#408641','#007E46','#008076','#0083AB','#005A89','#00437B','#00256E','#421E6C','#68006B','#A90068','#AC0047','#8A0000','#8D3A00','#905400','#998402','#58712A','#2E6B31','#006535','#00665E','#006988','#00456D','#003162','#000258','#2F0056','#540054','#870052','#8A0035','#D3B7A1','#A88E80','#816E64','#625550','#463D3B','#D6A279','#B8855E','#9E6D49','#875735'];this.aGrayscale=[];}
function EbayRTEColorPalette(pParent,pName,pConfig)
{if(!this.objType)
this.objType="EbayRTEColorPalette";this.base=EbayBaseControl;this.base(pParent,pName);this.oConfig=pConfig;this.oButton=new EbayRTEButtonColorPalette(this,pConfig.aButton[0][0],pConfig.aButton[0][1],pConfig.aButton[0][2],pConfig.bBtnStyle);this.oLayer=this.oSavedRange=null;this.sRTEElemName="rte";this.timeoutID=0;this.initialize=ebRTEColorPaletteInitialize;this.saveRTEEnv=ebRTEColorPaletteSaveRTEEnv;this.restoreRTEEnv=ebRTEColorPaletteRestoreRTEEnv;this.toggleDisplay=ebRTEColorPaletteToggleDisplay;this.toggleRTESelects=ebRTEColorPaletteToggleRTESelects;}
function ebRTEColorPaletteInitialize()
{var c=this.oConfig;if(!this.oLayer)
{this.oLayer=new EbayHTMLLayer(this,c.sLayerName,false,c);this.oLayer.subscribeEvents("onmouseover","onmouseout");this.oLayer.onmouseover=function()
{clearTimeout(this.parent.timeoutID);}
this.oLayer.onmouseout=function()
{var cp=this.parent.oUtils.controlPath(this.parent);this.parent.timeoutID=setTimeout(cp+".oLayer.show(false);"+cp+".toggleRTESelects(true);",2000);}
this.oLayer.bind();}}
function ebRTEColorPaletteSaveRTEEnv()
{with(this)
{var oPar=parent,rteFrame=oPar._getControl(sRTEElemName).oRTEFrame;if(rteFrame.bIE)
oSavedRange=rteFrame.eDocument.selection.createRange();toggleRTESelects(false);}}
function ebRTEColorPaletteRestoreRTEEnv()
{with(this)
{var oPar=parent,rteFrame=oPar._getControl(sRTEElemName).oRTEFrame;if(rteFrame.bIE)
oSavedRange.select();toggleRTESelects(true);}}
function ebRTEColorPaletteToggleDisplay(pState)
{if(this.oLayer)
this.oLayer.show(pState);}
function ebRTEColorPaletteToggleRTESelects(pState)
{with(this)
{var oPar=parent,rte=oPar._getControl(sRTEElemName);for(var i in rte.controls)
{if(rte.controls[i].objType=="EbayRTESelectInserts")
{rte.controls[i].show(pState);break;}}}}

//42@@m8

function EbayRTEButtonSpellCheck(pParent,pName,pNormalImage,pSelectedImage)
{if(!this.objType)
this.objType="EbayRTEButtonSpellCheck";this.base=EbayRTEButton;this.base(pParent,null,pName,pNormalImage,pSelectedImage);this.onclick=ebRTEButtonSpellCheckOnClick;this.oOverlay=null;this.parent.oSpellChecker=this;this.openOverlay=ebRTEButtonSpellCheckOpenOverlay;this.closeOverlay=ebRTEButtonSpellCheckCloseOverlay;this.updateHTML=ebRTEButtonSpellCheckUpdateHTML;this.submitForm=ebRTEButtonSpellCheckSubmitForm;}
function ebRTEButtonSpellCheckOnClick(e)
{with(this)
{var oC=parent.oConfig;parent.parent.oSelectedElem=this;if(oC.bCustomInitSpellcheck)
parent.parent.initSpellChecker()
else
{openOverlay(oC.sSpacerImgUrl);submitForm();}
return false;}}
function ebRTEButtonSpellCheckSubmitForm()
{with(this)
{var oC=parent.oConfig,oFrm=parent.parent._getControl(oC.sFormName),sAction,sOrigActionValue;if(!oFrm)
{oFrm=new EbayHTMLForm(this,oC.sFormName);oFrm.bind();}
oFrm.sOrigTarget=oFrm.getTarget();oFrm.sOrigAction=oFrm.getAction();sOrigActionValue=oFrm.getElementValue(oC.sActionElemName);oFrm.setElementValue(oC.sActionElemName,oC.sActionValue);sAction=oFrm.getAction();sAction=sAction+(sAction.has('?')>0?'&':'?')+'ej2child=true';oFrm.setAction(sAction);oFrm.setTarget(oOverlay.sIframeName);oFrm.submit();oFrm.setTarget(oFrm.sOrigTarget);oFrm.setAction(oFrm.sOrigAction);oFrm.setElementValue(oC.sActionElemName,sOrigActionValue);}}
function ebRTEButtonSpellCheckOpenOverlay(pUrl)
{with(this)
{var oC=parent.oConfig,oL=oOverlay;oC.width=oC.iOverlayWidth;oC.height=oC.iOverlayHeight;oC.sIframeClass=oC.sOverlayIframeClassName;if(!oL)
{oL=new EbayHTMLOverlayUrl(this,oC.sOverlayLayerID,oC);oL.iLeftPadding=0;oL.bDowngradeDomain=false;oL.bForceReposition=true;oL.bind();oL.setStyle('zIndex','1000');oOverlay=oL;}
oL.sUrl=pUrl;;oL.display();}}
function ebRTEButtonSpellCheckCloseOverlay()
{this.oOverlay.closeOverlay();}
function ebRTEButtonSpellCheckUpdateHTML(pHTML)
{this.parent.updateHTML(pHTML);this.closeOverlay();}

//43@@m1

function EbayAttributeDataConfig(pName)
{if(!this.objType)
this.objType='EbayAttributeDataConfig';this.base=EbayConfig;this.base(pName);this.aData=new Array();}

//44@@m1

function EbayAttributeDependencyConfig(pName)
{if(!this.objType)
this.objType='EbayAttributeDependencyConfig';this.base=EbayConfig;this.base(pName);this.sName='';this.sType='';this.aChildren=new Array();this.aKeys=new Array();this.aSelectedKeys=new Array();this.sDisabledMessage='';this.sDiv='';this.sOtherText='';this.bDialog=false;}

//45@@m36

function EbayAttributeManager(pParent,pName)
{if(!this.objType)
this.objType='EbayAttributeManager';this.base=EbayBaseControl;this.base(pParent,pName);this.aSections=[];this.sDelim="<!-- ##ATTR## -->";this.aDataConfig=[];this.oIntImg=[];this.oIntClkNme;this.aIntImg=[];this.selIntClass;this.unselIntClass;this.oIntHid;this.sIntHidFld;this.aIntHid;this.oExtImg=[];this.oExtClkNme;this.aExtImg=[];this.selExtClass;this.unselExtClass;this.oExtHid;this.sExtHidFld;this.aExtHid;this.bFSBO;this.sOthrTxt;this.bAttrTagged=false;with(this)
_registerListener(oDocument._getEvent("load"),EVENT_AFTER,"createControls");this.init=function(pBind)
{with(this)
{var oD=oDocument,cfg=oD.aConfigs,currentLyr,t=this;for(var i in cfg)
{var c=cfg[i];if(c.objType.is("EbayAttributeDependencyConfig"))
{var l=c.sDiv,oArttr;if(c.bFSBO)
{this.sOthrTxt=c.sOthrTxt;this.bFSBO=c.bFSBO;}
if(c.sType=='checkbox')
{oAttr=new EbayHTMLCheckbox(this,c.sName,null,c);oAttr._registerEvent('onclick','onChangeHandler');}
if(c.sType=='select'||c.sType=='multiselect')
{oAttr=new EbayHTMLSelectMulti(this,c.sName,null,c);oAttr.subscribeEvents("onkeyup");oAttr._registerEvent('onchange','onChangeHandler');oAttr._registerEvent('onkeyup','onChangeHandler');}
if(c.sType=='palette')
{if(c.bInt)
{t.aIntImg=c.aIntImg;t.selIntClass=c.selIntClass;t.unselIntClass=c.unselIntClass;t.aIntHid=c.aIntHid;t.oIntClkNme=new EbayHTMLLayer(this,c.sIntClrNme);if(!t.oIntClkNme.eElem)
t.oIntClkNme.bind();t.oIntHid=new EbayHTMLText(this,c.sIntHidFld);if(!t.oIntHid.eElem)
t.oIntHid.bind();for(i=0;i<t.aIntImg.length;i++)
{t.oIntImg[i]=new EbayHTMLImage(this,t.aIntImg[i]);if(!t.oIntImg[i].eElem)
t.oIntImg[i].bind();t.oIntImg[i]._registerEvent("onclick","parent.intImgClk");}}
else
{t.aExtImg=c.aExtImg;t.selExtClass=c.selExtClass;t.unselExtClass=c.unselExtClass;t.aExtHid=c.aExtHid;t.bEdmunds=c.bEdmunds?true:false;t.oExtClkNme=new EbayHTMLLayer(this,c.sExtClrNme);if(!t.oExtClkNme.eElem)
t.oExtClkNme.bind();t.oExtHid=new EbayHTMLText(this,c.sExtHidFld);if(!t.oExtHid.eElem)
t.oExtHid.bind();for(i=0;i<t.aExtImg.length;i++)
{t.oExtImg[i]=new EbayHTMLImage(this,t.aExtImg[i]);if(!t.oExtImg[i].eElem)
t.oExtImg[i].bind();if(!t.bEdmunds)
t.oExtImg[i]._registerEvent("onclick","parent.extImgClk");}}}
if(typeof(oAttr)!='undefined')
oAttr.onChangeHandler=this.onChangeHandler;if(currentLyr!=l&&l.length>0)
{var sec=aSections[aSections.length]=new EbayHTMLLayer(parent,l);sec.bind();currentLyr=l;}
if(c.sHelpId&&c.sHelpUrl)
{var hlp=new EbayHTMLAnchor(this,c.sHelpId);hlp.sHelpPage=c.sHelpUrl;hlp.onclick=function()
{var hs=this.parent.oDocument._getControl('help system'),oHA,oHP;if(hs)
{if(hs.bHelpInPopup)
{oHP=hs.oHelpPopup;sMoreHelpPage=null;oHP.sUrl=this.sHelpPage;oHP.show();}
else
{oHA=hs.oHelpAssistant;hs.bForceHelpPane=true;oHA.display(this.sHelpPage);hs.bForceHelpPane=false;}}
return false;}}
if(pBind&&(typeof(oAttr)!='undefined'))
oAttr.bind();}
if(c.objType.is("EbayAttributeDataConfig"))
this.aDataConfig=this.aDataConfig.concat(c.aData);}}}
this.intImgClk=function()
{var sTit=this.eElem.title,p=this.parent,sIntHid;for(i=0;i<p.aIntImg.length;i++)
p.oIntImg[i].setClass(p.unselIntClass);for(i=0;i<p.aIntImg.length;i++)
{if(this.name==p.aIntImg[i])
{p.oIntImg[i].setClass(p.selIntClass);sIntHid=p.aIntHid[i];break;}}
p.oIntClkNme.eElem.innerHTML=sTit;p.oIntHid.value(sIntHid);}
this.extImgClk=function()
{var sTit=this.eElem.title,p=this.parent,sExtHid;for(i=0;i<p.aExtImg.length;i++)
p.oExtImg[i].setClass(p.unselExtClass);for(i=0;i<p.aExtImg.length;i++)
{if(this.name==p.aExtImg[i])
{p.oExtImg[i].setClass(p.selExtClass);sExtHid=p.aExtHid[i];break;}}
p.oExtClkNme.eElem.innerHTML=sTit;p.oExtHid.value(sExtHid);}
this.createControls=function()
{var aSecs=this.aSections,l=aSecs.length;for(var i=0;i<l;i++)
{var lyr=aSecs[i].eElem,sel,inp,len;if(lyr)
{inp=lyr.getElementsByTagName('INPUT'),len=inp.length;for(var j=0;j<len;j++)
{if(inp[j].type=='checkbox'&&!this.oDocument._getControl(inp[j].name))
{var oAttr=new EbayHTMLCheckbox(this,inp[j].name);oAttr._registerEvent('onclick','onChangeHandler');oAttr.bind();}}
sel=lyr.getElementsByTagName('SELECT'),len=sel.length;for(var j=0;j<len;j++)
{var ctl=this.oDocument._getControl(sel[j].name),oAttr;if(!ctl)
{oAttr=new EbayHTMLSelectMulti(this,sel[j].name);oAttr._registerEvent('onchange','onChangeHandler');oAttr.bind();}}}}}
this.createNewAjaxControls=function(pSec)
{if(!pSec.eElem)
pSec.bind();var elem=pSec.eElem;if(!elem)
return;var aSels=elem.getElementsByTagName('SELECT'),aSelLen=aSels.length;for(var k=0;k<aSelLen;k++)
{var cn=aSels[k].name;if(!this.controls[cn])
{var oScript=elem.getElementsByTagName('SCRIPT'),oSlen=oScript.length;for(var l=0;l<oSlen;l++)
{if(oScript[l].innerHTML.has(cn))
eval(oScript[l].innerHTML);}
var oAttr=new EbayHTMLSelectMulti(this,cn,null,ebay.oDocument.getConfig('Selling.Describe.Attr_'+cn.substr(4)));oAttr._registerEvent('onchange','parent.onChangeHandler');}}}
this.resetHelpIds=function(pSec)
{if(!pSec.eElem)
pSec.bind();var elem=pSec.eElem;if(!elem)
return;var a=elem.getElementsByTagName('a'),l=a.length,hs=this.parent.oDocument._getControl('help system');for(var i=0;i<l;i++)
{var id=a[i].id,hlp=id.has('_helpLink');if(hlp)
{var ctl=this.controls[id];if(ctl)
ctl.bind();else
hs.createHelpLinks(id);}}}
this.onChangeHandler=function()
{var oCfg=this.oConfig;if(!oCfg)return;var isDialog=oCfg.bDialog,et=oCfg.sType;var controlName=isDialog?'attribute-dialog-manager':'attribute-manager';var keys=oCfg.aKeys,kl=keys.length;var cn=oCfg.aChildren,cl=cn.length;var pSelVals=[],pSelIndex=pl=0;if(et=='select'||et=='multiselect')
{pSelVals=this.getSelectedValues();this.parent.resetChildren(this);}
else if(et=='checkbox')
{var oCB=document.getElementsByName(oCfg.sName),pl=oCB.length;for(var i=0;i<pl;i++)
pSelVals[pSelIndex++]=oCB[i].checked?oCB[i].value:null;}
var u=ebay.oUtils;if(u.isInArray(pSelVals,'-6')&&!oCfg.bSelling)
{this.parent.showOther(oCfg.sOtherText,true);return;}
else
this.parent.showOther(oCfg.sOtherText,false)
if(oCfg.bFSBO)
{if(u.isInArray(pSelVals,'-16'))
this.parent.showOther(oCfg.sOthrTxt,true);else
this.parent.showOther(oCfg.sOthrTxt,false)}
if(kl>0)
{if(cl>0)
{var hasData=false;for(var i=0;i<cl;i++)
{hasData=this.parent.setChildValues(cn[i],pSelVals,true);if(!hasData)
break;}
if(!hasData)
{if(!isDialog)
{var sUrl='http://'+document.domain;if(this.oGlobals.oEnvironment.sSiteID.is('100'))
sUrl+='/ebaymotors';sUrl+='/ws/eBayISAPI.dll';var req=ebay.oServer.createRequest('req_attr',sUrl,false);req.sPostData=this.parent.getPostData();req.iResponseType=1;req.registerAsDataListener(this.parent);req.send();}
else
{var oD=ebay.oDocument,hiddenElem=oD._getControl('pfdep');hiddenElem.setValue('Apply');var formElem=oD._getControl('selling');formElem.submit();}}}}
else
{for(var i=0;i<cl;i++)
this.parent.setChildValues(cn[i],pSelVals);}
var p=this.parent;if(p&&!p.bAttrTagged)
{var oSOJ=ebay.oP.controls['soj_tagging'];if(oSOJ)
oSOJ.registerTag({"k":"AttributesUsed"});p.bAttrTagged=true;}}
this.processDataResponse=function(pResp)
{var pText=pResp.sResponseText;var result=pText.split(this.sDelim);var resLen=result.length;var secLen=this.aSections.length;var currentSection,scriptCollection,scriptCollectionLength=0;for(var i=0;i<secLen;i++)
{for(var j=0;j<resLen;j++)
{if(result[j].indexOf(this.aSections[i].name)!=-1)
{var sectionInnerHTML=result[j].substring(12);var indexOfGt=sectionInnerHTML.indexOf(">")+1;sectionInnerHTML=sectionInnerHTML.substring(indexOfGt);sectionInnerHTML=sectionInnerHTML.substring(0,sectionInnerHTML.length-28)
this.aSections[i].setValue(sectionInnerHTML);this.createNewAjaxControls(this.aSections[i]);this.resetHelpIds(this.aSections[i]);break;}}}
for(var i in this.controls)
{var ctl=this.controls[i];ctl.bDisabled=false;ctl.bind();}}
this.getPostData=function()
{var s='MfcISAPICommand=SYI3LoadDepAttributes&aid=48&cpg=6';s+='&sid='+document.getElementById('sid').value;var itemId=document.getElementById('itemid');if(itemId)
s+='&itemid='+itemId.value;var a=this.aSections,l=a.length;for(var i=0;i<l;i++)
{var elem=a[i].eElem;if(elem)
{var inp=elem.getElementsByTagName('INPUT'),lInp=inp.length;for(var j=0;j<lInp;j++)
{var e=inp[j],n=e.name?e.name:e.id?e.id:null;if(n)
{s+='&'+n+'=';if((e.type=='text'||e.type=='hidden')||((e.type=='checkbox'||e.type=='radio')&&e.checked))
s+=encodeURIComponent(e.value);}}
var sel=elem.getElementsByTagName('SELECT'),lSel=sel.length;for(var j=0;j<lSel;j++)
{var e=sel[j],n=e.id?e.id:e.name?e.name:null;if(n)
{var ctl=this.oDocument._getControl(n);if(ctl)
{var sv=ctl.getSelectedValues(),svl=sv.length;for(var k=0;k<svl;k++)
s+='&'+n+'='+sv[k];}}}}}
return s;}
this.setChildValues=function(pElem,pParentKeys,pRet)
{var e=this.controls[pElem],cv;if(!e||e.objType!='EbayHTMLSelectMulti')
return;var cv=[],cd=this.aDataConfig,pk=pParentKeys,kl=pk.length,bFound=false;for(var i=0;i<kl;i++)
{var cdl=this.aDataConfig.length;for(var j=0;j<cdl;j++)
{if(cd[j].collectionName=='v'+pk[i]&&pElem==cd[j].attributeName)
{cv=cd[j].collectionData;bFound=true;break;}}
if(bFound)
break;}
if(!e.eElem)
e.bind();if(cv.length>0)
{var selInd=0,l=cv.length,tLen=0;e.enable(true);e.setClass('fieldenabled');e.clearOptions();for(var i=0;i<l;i++)
{e.createOption(cv[i][1],cv[i][0]);if(selInd==0)
selInd=cv[i][2]?i:0
if(cv[i][0].length>tLen)
tLen=cv[i][0].length;}
if((l==1)&&(e.getSelectedValue()==-16)&&this.bFSBO)
this.showOther(this.sOthrTxt,true);else
this.showOther(this.sOthrTxt,false);if(selInd>0)
e.selectByIndex(selInd);if(e.eElem)
{var selWidth=parseInt(tLen*8);selWidth=selWidth<105?105:selWidth;e.eElem.style.width=selWidth+'px';}
if(pRet)
return true;}
else if(e.bDisabled&&(e.getSelectedValue()==-10)&&this.bFSBO)
this.showOther(this.sOthrTxt,true);else if(!pRet)
this.clearChildren(pElem);else
{e.enable(bFound);if(!bFound&&e.eElem)
e.selectByIndex(0);return false;}}
this.clearChildren=function(pElem)
{var e=this.controls[pElem];if(!e||!e.oConfig)
return;switch(e.oConfig.sType)
{case"select":case"multiselect":{e.clearOptions();e.createOption('-10','-    ');if(e.eElem)
e.eElem.style.width="120px";e.enable(false);this.showOther(e.oConfig.sOtherText,false);break;}
case"checkbox":{e.check(false);break;}}}
this.resetChildren=function(pElem)
{if(!pElem||!pElem.oConfig)
return;var cn=pElem.oConfig.aChildren;if(!cn)
return;for(var i=0,cl=cn.length;i<cl;i++)
{this.clearChildren(cn[i]);this.resetChildren(this.controls[cn[i]]);}}
this.showOther=function(pOtherText,pShow)
{var d=this.oDocument,other=d.getUIElem(pOtherText+'_inp'),oT;if(other)
{if(!pShow)
{var oT=d.getUIElem(pOtherText);if(oT)
oT.value='';}
var dis=pShow?'block':'none';var vis=pShow?'visible':'hidden';if(other)
{other.style.display=dis;other.style.visibility=vis;}}}
this.init();}

//46@@m32

function EbaySYI3SellerTags(pParent,pName,pCfg,pInit)
{if(!this.objType)
this.objType="EbaySYI3SellerTags";this.base=EbayBaseControl;this.base(pParent,pName);var t=this;t.oConfig=pCfg;t.oTopSecLayer=new EbayHTMLLayer(t,pCfg.sTopSectionLyr);t.oSugSecLayer=new EbayHTMLLayer(t,oSC.sSugSectionLyr);t.oCustomLnk=new EbayHTMLLayer(t,oSC.sCustomLyrId);t.oTrayLayer=new EbayHTMLLayer(t,oSC.sTrayId);t.oMsgLyr=new EbayHTMLLayer(t,pCfg.sWarningMsgId);t.oUtils=new EbaySYI3SellerTagUtils(t,'seller_tag_utils');t.oHiddenIndex=new EbayHTMLText(t,pCfg.sIndexTxtId);if(pCfg.oOverlayCfg)
{var c=pCfg.oOverlayCfg;var cCfg=ebay.oDocument.getConfig('Selling.Common');c.bOnFocus=cCfg.bOnFocus;c.sStartLyrName=cCfg.sStartLyrName;t.oOverlayTag=new EbaySYI3OverlayTagControl(t,c);}
t.oDividerLayer=pCfg.sDividerLyr?new EbayHTMLLayer(t,pCfg.sDividerLyr):null;t.iTotalTopTags=0;t.iTotalSugTags=0;t.iMaxSugTag=pCfg.iMaxSugTag;t.isMSKUFlow=pCfg.isMSKUFlow;t.oTagControls=[];t.oSugTagControls=[];t.oCustomControls=[];t.sCusLyrIdInDialog=null;t.oAjaxListner=null;t.oSpellUOM=null;t.oSpellUOMParent=null;t.sSpellOriginalValue="";t.sSpellSugValue="";t.aSpellUOMResponse="";t.iTagIndex=0;t.sCurrentTitle="";t.oCurrentTag=null;t.bLyrStatus=false;t.aGradNames=[];t.sOPTIONS="option_";t.SpellUOMCheckId=null;t.bGradNameRecoCall=true;t.oHelpPop=null;t.bSOJTagged=false;t.aTsrc={customNoAutoSug:'0',customAutoSug:'1',recoTop:'2',trayUsed:'3',trayUnUsed:'4',stored:'5'};t.aTaction={none:'0',removed:'1',custom:'2'};t.aSelValSrc={manualNoAuto:'0',manualAuto:'1',fromReco:'2',fromPrevList:'3'};this.bindObj=function(pObj)
{if(!pObj.eElem)
pObj.bind();}
this.init=function()
{var t=this;with(t)
{var c=oConfig,aTT=c.aTags,aTTLen=aTT.length,oTitle=parent.controls[oSC.sTitleId],cnt,len;bindObj(oTrayLayer);var pCfg=ebay.oDocument.getConfig('Selling.Common');if(pCfg.isCollapseEanbled){cnt=c.iInitialTopTag;}
else{cnt=c.iInitialTopTag?c.iInitialTopTag:c.iMaxTopTag;}
if(c.iChildTag>0)
cnt=cnt-c.iChildTag;for(var i=0;i<aTTLen;i++)
{var att=aTT[i],tn=att.tn,tnCtrl=tn.replace(/\s/g,"");if(iTotalTopTags<cnt)
{if(att.bMV)
{var aTagVals=[];var aVals=[];var iOpt=0;len=att.Vals.length;for(index=0;index<len;index++)
{if(index<oSC.iMVCBDefCount||att.Vals[index].Sel)
aTagVals.push(att.Vals[index]);else
{aVals[iOpt]=att.Vals[index];iOpt++;}}
att.Vals=aVals;oTagControls[tnCtrl]=new EbaySYI3MultiValueControl(t,tn,iTagIndex,aTsrc.recoTop,true,att,aTagVals,c);if(att.aChildren)
{oTagControls[tnCtrl]=new EbaySYI3DepTagControl(t,null,tn,iTagIndex,aTsrc.recoTop,true,att,false,c,0,false);iTotalTopTags=iTotalTopTags+att.aChildren.length;}}
else if(att.aChildren)
{oTagControls[tnCtrl]=new EbaySYI3DepTagControl(t,null,tn,iTagIndex,aTsrc.recoTop,true,att,false,c,0,false);iTotalTopTags=iTotalTopTags+att.aChildren.length;}
else
oTagControls[tnCtrl]=new EbaySYI3TagControl(t,null,tn,iTagIndex,aTsrc.recoTop,false,att,false,c);iTotalTopTags++;}
else
{tnCtrl=tnCtrl.replace(new RegExp("'","g"),"");oSugTagControls[tnCtrl]=new EbaySYI3SuggestTagControl(t,tn,iTagIndex,aTaction.none,false,att,c);if(att.aChildren)
{len=att.aChildren.length;for(var ii=0;ii<len;ii++)
iTagIndex++;}
iTotalSugTags++;}
iTagIndex++;}
if(!oTitle)
{oTitle=new EbayHTMLText(t,oSC.sTitleId);oTitle._registerEvent('onblur','parent.getTagsForTitle');oTitle._registerEvent('onfocus','parent.setCurrentTitle');}
else
{oTitle._registerEvent('onblur','parent.controls[\'seller_tags\'].getTagsForTitle');oTitle._registerEvent('onfocus','parent.controls[\'seller_tags\'].setCurrentTitle');}
if(!oMsgLyr.eElem)
bindObj(oMsgLyr);oCustomLnk._registerEvent('onclick','parent.addCustomTag');}}
this.setCurrentTitle=function()
{var t=this,p=t.parent,oST=p.objType.is('EbayPage')?p.controls['seller_tags']:p;oST.sCurrentTitle=t.getValue();}
this.getTagsForTitle=function()
{var t=this,p=t.parent,oST=p.objType.is('EbayPage')?p.controls['seller_tags']:p;with(oST)
{var v=t.getValue(),c=oConfig,u=oUtils;v=u.trim(v);if((sCurrentTitle&&v==sCurrentTitle)||v=="")
return;if(c&&oSC.bTitleAJAXEnabled)
{oAjaxListner=processTitleResponse;oUtils.bShowProgress=true;oUtils.requestData(c.sAJAXUrl.replaceTokens(oSC.aActionIdVals.fullReco,encodeURIComponent(v),"",""));}}}
this.processTitleGuidResponse=function(pData)
{var sCfg=ebay.oDocument.getConfig('Selling.Title.SherpaGuidance');if(sCfg){sResp=pData.sherparesp;sRespAddkwd=sResp[0].addkwd;sRespRemkwd=sResp[0].removekwd;sRespAddinfo=sResp[0].addinfo;TitleSugLyr=new EbayHTMLLayer(this,sCfg.SugLyr);if(!TitleSugLyr.eElem)
TitleSugLyr.bind();LegalCntLyr=new EbayHTMLLayer(this,sCfg.legalCnt);if(!LegalCntLyr.eElem)
LegalCntLyr.bind();if(!sRespAddkwd&&!sRespRemkwd&&!sRespAddinfo){TitleSugLyr.eElem.style.display="none";LegalCntLyr.eElem.style.display="none";}
addkwdBtmLyr=new EbayHTMLLayer(this,sCfg.addkwdBtm);if(!addkwdBtmLyr.eElem)
addkwdBtmLyr.bind();addkwdBtmLyr.eElem.innerHTML='';addonekwdLyr=new EbayHTMLLayer(this,sCfg.addonekwd);if(!addonekwdLyr.eElem)
addonekwdLyr.bind();addonekwdLyr.eElem.innerHTML='';addmanykwdLyr=new EbayHTMLLayer(this,sCfg.addmanykwd);if(!addmanykwdLyr.eElem)
addmanykwdLyr.bind();addmanykwdLyr.eElem.innerHTML='';remkwdBtmLyr=new EbayHTMLLayer(this,sCfg.remkwdBtm);if(!remkwdBtmLyr.eElem)
remkwdBtmLyr.bind();remkwdBtmLyr.eElem.innerHTML='';removekwdLyr=new EbayHTMLLayer(this,sCfg.removekwd);if(!removekwdLyr.eElem)
removekwdLyr.bind();removekwdLyr.eElem.innerHTML='';removemanykwdLyr=new EbayHTMLLayer(this,sCfg.removemanykwd);if(!removemanykwdLyr.eElem)
removemanykwdLyr.bind();removemanykwdLyr.eElem.innerHTML='';addinfoLyr=new EbayHTMLLayer(this,sCfg.addinfo);if(!addinfoLyr.eElem)
addinfoLyr.bind();addinfoLyr.eElem.innerHTML='';addmanyinfoLyr=new EbayHTMLLayer(this,sCfg.addmanyinfo);if(!addmanyinfoLyr.eElem)
addmanyinfoLyr.bind();addmanyinfoLyr.eElem.innerHTML='';infoBtmLyr=new EbayHTMLLayer(this,sCfg.infoBtm);if(!infoBtmLyr.eElem)
infoBtmLyr.bind();infoBtmLyr.eElem.innerHTML='';if(sRespAddkwd)
{kwdLen=(sRespAddkwd.length);if(kwdLen==1){addkeyCnt=sCfg.addkey.replaceTokens(sRespAddkwd[0].key);addonekwdLyr.eElem.innerHTML=addkeyCnt;}
else{addKeyVal=sRespAddkwd[0].key;if(kwdLen>2){for(j=1;j<kwdLen-1;j++)
{addKeyVal+=", "+sRespAddkwd[j].key;}}
addmanykeyCnt=sCfg.addkeys.replaceTokens(addKeyVal,sRespAddkwd[kwdLen-1].key);addmanykwdLyr.eElem.innerHTML=addmanykeyCnt;}
if(kwdLen==1)
addkwdBtmLyr.eElem.innerHTML=addkeyCnt;else
addkwdBtmLyr.eElem.innerHTML=addmanykeyCnt;if(!sRespRemkwd&&!sRespAddinfo)
addkwdBtmLyr.eElem.innerHTML=addkwdBtmLyr.eElem.innerHTML.substr(1);}
if(sRespRemkwd){rkwdLen=sRespRemkwd.length;if(rkwdLen==1){remkeyCnt=sCfg.remkey.replaceTokens(sRespRemkwd[0].rkwd);removekwdLyr.eElem.innerHTML=remkeyCnt;}
else{remKeyVal=sRespRemkwd[0].rkwd;if(rkwdLen>2){for(j=1;j<rkwdLen-1;j++)
{remKeyVal+=", "+sRespRemkwd[j].rkwd;}}
remmanykeyCnt=sCfg.remkeys.replaceTokens(remKeyVal,sRespRemkwd[rkwdLen-1].rkwd);removemanykwdLyr.eElem.innerHTML=remmanykeyCnt;}
if(rkwdLen==1)
remkwdBtmLyr.eElem.innerHTML=remkeyCnt;else
remkwdBtmLyr.eElem.innerHTML=remmanykeyCnt;if(!sRespAddkwd&&!sRespAddinfo)
remkwdBtmLyr.eElem.innerHTML=remkwdBtmLyr.eElem.innerHTML.substr(1);}
if(sRespAddinfo){addinfoLen=sRespAddinfo.length;if(addinfoLen==1){addinfoCnt=sCfg.addinf.replaceTokens(sRespAddinfo[0].info);addinfoLyr.eElem.innerHTML=addinfoCnt;}
else{manyInfoVal=sRespAddinfo[0].info;if(addinfoLen>2){for(j=1;j<addinfoLen-1;j++)
{manyInfoVal+=", "+sRespAddinfo[j].info;}}
manyInfoCnt=sCfg.addinfos.replaceTokens(manyInfoVal,sRespAddinfo[addinfoLen-1].info);addmanyinfoLyr.eElem.innerHTML=manyInfoCnt;}
if(addinfoLen==1)
infoBtmLyr.eElem.innerHTML=addinfoCnt;else
infoBtmLyr.eElem.innerHTML=manyInfoCnt;if(!sRespAddkwd&&!sRespRemkwd)
infoBtmLyr.eElem.innerHTML=infoBtmLyr.eElem.innerHTML.substr(1);}
if(sRespAddkwd||sRespRemkwd||sRespAddinfo){TitleSugLyr.eElem.style.display="block";LegalCntLyr.eElem.style.display="block";}}}
this.processTitleResponse=function(pData)
{var t=this;with(t)
{var aData=pData.TagNmValLst,l=aData.length,u=oUtils,c=oConfig,s=0,bIsSugTag,iTotalTopCount=0,aTrash=new Array(),len;if(!l)
return;for(var sTn in oTagControls)
{if(oSugTagControls[sTn]&&!oTagControls[sTn].oParentTag)
{var bHasReco=false;for(var i=0;i<l;i++)
{if(aData[i].tn==sTn)
{bHasReco=true;break;}}
if(!bHasReco)
delete oTagControls[sTn];}}
for(var i in oTagControls)
{var oTag=oTagControls[i],rmv=false;if(!oTag.bIsRetain&&!oTag.bIsEdited&&oTag.iTsrc==t.aTsrc.recoTop&&(oTag.oParentTag?!oTagControls[oTag.oParentTag.sTagCtrlName]:true)&&!oTag.aChild&&!oTag.bIsHiddenTag)
{u.removeChild(oTag.oTagOuterLayer.name);aTrash.push(oTagControls[i]);delete oTagControls[i];iTotalTopTags--}}
for(var i in oTagControls)
{if(!oTagControls[i].bIsRemoved&&oTagControls[i].oParentTag)
iTotalTopCount++;}
for(var i=0;i<l;i++)
{bIsSugTag=iTotalTopCount<c.iMaxTopTag?false:true;var aTags=bIsSugTag?aData[l-s-1]:aData[i];var j=aTags.tn,tnCtrl=j.replace(/\s/g,"");if(oSugTagControls[tnCtrl]||(oTagControls[tnCtrl]&&oTagControls[tnCtrl].bIsRemoved))
continue;if(!bIsSugTag)
{if(!oTagControls[tnCtrl])
{var idx=iTagIndex;if(aTags.bMV)
{var aTagVals=[];var aVals=[];var iOpt=0;len=aTags.Vals.length;for(index=0;index<len;index++)
{if(index<c.iMaxTopTag)
aTagVals[index]=aTags.Vals[index];else
{aVals[iOpt]=aTags.Vals[index];iOpt++;}}
aTags.Vals=aVals;}
aTags.aValues=[];if(aTags.bClosed)
aTags.aValues.unshift("-");len=aTags.Vals.length;for(var ind=0;ind<len;ind++)
{aTags.aValues.push(aTags.Vals[ind].Val);}
sTitle=u.getIcons([aTags.bReq])+aTags.tn+u.getHelpIcon(aTags.sHelpUrl,idx);html=aTags.bMV?u.getMultiValueHTML(aTagVals,sTitle,idx,aTags):u.getTopTagHTML(idx,sTitle,false,null,aTags);u.appendChild(c.sTopSectionLyr,html,oSC.sTagOuterLyrPrefix+idx,'span');oTagControls[tnCtrl]=aTags.bMV?new EbaySYI3MultiValueControl(t,j,idx,aTsrc.recoTop,true,aTags,aTagVals,c):aTags.aChildren?new EbaySYI3DepTagControl(t,null,j,idx,aTsrc.recoTop,true,aTags,false,c,null):new EbaySYI3TagControl(t,null,j,idx,aTsrc.recoTop,true,aTags,false,c,null);oTagControls[tnCtrl].aTagAttr.aChildren?u.createChildTags(oTagControls[tnCtrl],1):iTotalTopCount++;;oTagControls[tnCtrl].oRemove.show(!oTagControls[tnCtrl].bIsRequired);iTagIndex++;u.setHiddenIndex(iTagIndex);u.addTopTagsCount(true);if(oSugTagControls[j])
{u.removeChild(oSugTagControls[j].oSugTag.name);delete oSugTagControls[j];iTotalSugTags--;}}
else
{with(oTagControls[tnCtrl])
{if(!bIsEdited)
{u.setTagOptions(oTagControls[tnCtrl],oTagControls[tnCtrl].aOptions,oTagControls[tnCtrl].bIsClosed);if(!bNoDropDown)
oTagText.setValue(sSelVal);bSuggestionCreated=false;}}}}
else
{if(!oTagControls[tnCtrl])
{if(oSugTagControls[tnCtrl])
{u.removeChild(oSugTagControls[tnCtrl].oSugTag.name);delete oSugTagControls[tnCtrl];iTotalSugTags--;}
var iIndex=iTagIndex++,sSugTagId=oSC.sSugTagPrefix+iIndex,sSugHTML=c.sSugTagHTML.replaceTokens(j,c.sHiddenParamPrefix+iIndex);u.insertFirst(oSC.sSugSectionLyr,sSugHTML,sSugTagId);u.setHiddenIndex(iTagIndex);oSugTagControls[tnCtrl]=new EbaySYI3SuggestTagControl(t,j,iIndex,aTaction.none,true,aTags,c);iTotalSugTags++;if(iTotalSugTags>iMaxSugTag)
{var sLastChildId=u.getLastChildId(oSC.sSugSectionLyr);u.removeChild(sLastChildId);for(var k in oSugTagControls)
{if(oSugTagControls[k].oSugTag.name==sLastChildId)
delete oSugTagControls[k];}
iTotalSugTags--;}}
s++;}}
if(iTotalTopCount<c.iMaxTopTag)
{len=aTrash.length;for(var i=0;i<len;i++)
{var idx=iTagIndex++,sCtrlName=aTrash[i].name,oTag=aTrash[i],tnCtrl=aTrash[i].name.replace(/\s/g,""),sTagName=oTag.sTagCtrlName,aVals=oTag.aValues,iRow=0,sMultiHTML="",sAddBtnHTML="",bMV=oTag.bMultiVal;var sTitle=u.getIcons([oTag.aTagAttr.bReq])+sCtrlName+u.getHelpIcon(oTag.aTagAttr.sHelpUrl,idx);var html=bMV?u.getMultiValueHTML(oTag.aTagVals,sTitle,idx,oTag):u.getTopTagHTML(idx,sTitle,false,null,oTag);if(!oTagControls[tnCtrl])
{u.appendChild(c.sTopSectionLyr,html,oSC.sTagOuterLyrPrefix+idx,'span');oTagControls[tnCtrl]=bMV?new EbaySYI3MultiValueControl(t,sCtrlName,idx,aTsrc.recoTop,true,oTag.aTagAttr,oTag.aTagVals,c,oTag?oTag.oParentTag:null,oTag&&oTag.oParentTag?oTag.oParentTag.iChildIndex+1:0):(oTag&&oTag.aTagAttr.aChildren)?new EbaySYI3DepTagControl(t,oTag.oParentTag,sCtrlName,idx,aTsrc.recoTop,true,oTag.aTagAttr,false,c,oTag.oParentTag?oTag.oParentTag.iChildIndex+1:0):new EbaySYI3TagControl(t,null,sCtrlName,idx,aTsrc.recoTop,true,aTrash[i].aTagAttr,false,c,oTag&&oTag.oParentTag?oTag.oParentTag.iChildIndex+1:0);oTagControls[sCtrlName]=new EbaySYI3TagControl(t,null,sCtrlName,idx,aTsrc.recoTop,true,aTrash[i].aTagAttr,false,c,null);u.setHiddenIndex(iTagIndex);u.addTopTagsCount(true);iTotalTopCount++;if(iTotalTopCount>c.iMaxTopTag)break;}}}
if(iTotalSugTags>0)
{bindObj(oTrayLayer);var b=oTrayLayer.getStyle('visibility')=='visible';if(!b)
oTrayLayer.show(true);if(oDividerLayer)
oDividerLayer.show(true);}}}
this.addCustomTag=function()
{var t=this,p=t.parent;c=p.oConfig,u=p.oUtils;if(c.bAutoCompleteEnabled&&p.aGradNames.length==0&&p.bGradNameRecoCall)
{p.oAjaxListner=p.processGradNameResponse;u.requestData(c.sAJAXUrl.replaceTokens(oSC.aActionIdVals.gradNames,"","",""));}
p.addCustomControl();}
this.processGradNameResponse=function(pData)
{var t=this;with(t)
{aGradNames=pData.TagNmLst;}}
this.addCustomControl=function()
{var t=this;with(t)
{var c=oConfig,ind=iTagIndex,idx=ind++;u=oUtils,html=u.getCustomTagHTML(idx),sCCName='cc_'+oSC.sCustomOuterLyr+idx;sCusLyrIdInDialog=sCCName;var cCfg=ebay.oDocument.getConfig('Selling.Common');c.bOnFocus=cCfg.bOnFocus;c.sStartLyrName=cCfg.sStartLyrName;t.oOverlayTag.displayOverlay(u.getCustomTagHTML(idx),t,t.oCustomLnk);oCustomControls[sCCName]=new EbaySYI3CustomTagControl(t,sCCName,idx,c);oCustomControls[sCCName].oRemoveLnk.show(false);t.oOverlayTag.oCustomControl=oCustomControls[sCCName];iTagIndex++;if(t.isMSKUFlow)
t.oOverlayTag.oSaveButton.enable(false);yoLayer=new EbayHTMLLayer(this,"yoDiv");yoLayer.bind();if(((ebay.oDocument.oPage.changeLen==null||ebay.oDocument.oPage.changeLen==undefined)&&(c&&c.aAddVarLen==0))||ebay.oDocument.oPage.changeLen==0)
{var yoId=document.getElementById("yourOwn");if(yoId)
yoId.click();if(yoLayer.eElem)
yoLayer.show();}}}
this.createTopTag=function(pHtml)
{var t=this,u=t.oUtils,c=t.oConfig;var oCC=t.oCustomControls[t.sCusLyrIdInDialog];if(!oCC)
return;u.appendChild(c.sTopSectionLyr,pHtml,oCC.oOuterLyr.name,'span');oCC.unbindCusObj();oCC.bindCusObj();if(t.oSugLink)
t.oSugLink.bind();if(t.oValLink)
t.oValLink.bind();oCC.oNameTexBox.setValue(oCC.iTname);if(oCC.sSugValue)
oCC.oValueTexBox.setValue(oCC.sSugValue);else
oCC.oValueTexBox.setValue(oCC.sCurTextVal);oCC.oRemoveLnk.show(true);t.iTagIndex++;u.addTopTagsCount(true);u.setHiddenIndex(t.iTagIndex);}
if(typeof pInit=='undefined'||pInit)
t.init();}
function EbaySYI3MultiSkuSellerTags(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbaySYI3MultiSkuSellerTags";this.base=EbaySYI3SellerTags;this.base(pParent,pName,pCfg,false);var t=this;t.oValueMsgLyr=new EbayHTMLLayer(t,oSC.sWarningValueId);t.iTotalMSKUTag=0;this.init=function()
{var t=this;with(t)
{var c=oConfig,aTT=c.aTags,aTTLen=aTT.length,cnt;bindObj(oTrayLayer);for(var i=0;i<aTTLen;i++)
{var att=aTT[i],tn=att.tn,iIdx=att.iSortOrder,sTname=tn.replace(/\s/g,""),tnCtrl=sTname+iIdx,iTopTagIdx=0,iTopTagIdx_child=0,oSugTag=oSugTagControls[tnCtrl];if(!oSugTag)
{oSugTag=oSugTagControls[tnCtrl]=new EbaySYI3SuggestTagControl(t,tn+iIdx,iIdx,aTaction.none,false,att,c,true);if(att.bIsTopTag)
iTotalTopTags++;else
iTotalSugTags++;}
if(iIdx>iTagIndex)
iTagIndex=iIdx;if(att.bIsTopTag){if(att&&att.aChild){iTopTagIdx_child=att.aChild.iSortOrder+"_"+oSugTag.iTopTagIdx;}
iTopTagIdx=oSugTag.iTopTagIdx;oSugTag.iTopTagIdx++;oSugTag.iTotalTopTag++;oSugTag.oHiddenText.setValue(oSugTag.iTopTagIdx);iTopTagIdx=iIdx+"_"+iTopTagIdx;tnCtrl=sTname+iTopTagIdx;att.aChildren?oTagControls[tnCtrl]=new EbaySYI3DepTagControl(t,null,tn+iTopTagIdx,iTopTagIdx,aTsrc.recoTop,false,att,false,c,oSugTag):oTagControls[tnCtrl]=new EbaySYI3TagControl(this,null,tn+iTopTagIdx,iTopTagIdx,aTsrc.recoTop,false,att,false,c,oSugTag);if(att&&att.aChild){att.aChild.bChildVar=true;oTagControls[tnCtrl]=new EbaySYI3TagControl(this,null,att.aChild.tn+iTopTagIdx_child,iTopTagIdx_child,aTsrc.recoTop,false,att.aChild,false,c,oSugTag);}
oSugTag.aTagCtrls.push(oTagControls[tnCtrl]);iTotalMSKUTag++;}}
iTagIndex++;if(!oMsgLyr.eElem)
bindObj(oMsgLyr);if(!oValueMsgLyr.eElem)
bindObj(oValueMsgLyr);oCustomLnk.subscribeEvents('onclick');oCustomLnk._registerEvent('onclick','parent.addCustomTag');}}
this.init();}

//47@@m49

function EbaySYI3TagControl(pParent,pParentTag,pName,pIndex,pSource,pIsBind,pTagAttr,pMultiVal,pCfg,pSugCtrl,pChildIndex)
{if(!this.objType)
this.objType="EbaySYI3TagControl";this.base=EbayBaseControl;this.base(pParent,pName);var t=this,c=pCfg,pI=pIndex,att=pTagAttr;t.pI=pI;t.aOptions=att.Vals;t.aValues=[];t.aAutoCompleteValues=[];t.aTagAttr=att;t.oParentTag=pParentTag;t.sTagCtrlName=pName.replace(/\s/g,"");t.bIsClosed=typeof(att.bClosed)!='undefined'&&att.bClosed;t.bIsHiddenTag=typeof(att.bH)!='undefined'&&att.bH;t.sSelVal="";t.iTname=pCfg.isMSKUFlow?pName.replace(pI,""):t.name;t.iTsrc=pSource;t.iTaction=pParent.aTaction.none;t.sValSrc="";t.iChildIndex=pChildIndex?pChildIndex:0;t.sSuffix=pI;t.sOPTIONS=oSC.sTagValOptLyrPrefix+pI+'_option_';t.bSuggestionCreated=false;t.iSelOption=0;t.sSelOptionVal="";t.sCurTextVal="";t.bIsBind=pIsBind;t.bIsEdited=false;t.bIsPrePopulated=false;t.bIsRequired=att.bReq;t.sHelpUrl=att.sHelpUrl;t.bIsRetain=(pI<c.iRigidTagNameCount)||(att.src&&att.src!=2);t.bIsRemoved=false;t.bTagInOverlay=false;t.bMultiVal=pMultiVal;t.bNoDropDown=(t.bIsClosed&&t.bMultiVal&&t.aOptions.length==0);t.oSugCtrl=pSugCtrl;t.oTagOuterLayer=new EbayHTMLLayer(t,oSC.sTagOuterLyrPrefix+pI);t.oTagNameLayer=new EbayHTMLLayer(t,oSC.sTagNameLyrPrefix+pI);t.bDate=att.bDate;t.bFull=att.bFull;t.bPartial=att.bPartial;t.bYear=att.bYear;t.bVaries=att.bVaries;t.Months=[];t.Months=att.Months;t.monTxt=att.MonthTxt;t.dayTxt=att.DayTxt;t.yearTxt=att.YearTxt;t.selYr,t.selParDt;t.sSelMonInd="";t.sSelDayInd="";t.evtDateHdnTxt=new EbayHTMLText(t,c.sTagTextBoxPrefix+pI);t.evtDateHdnTxt.bind();t.evntDateLyr=new EbayHTMLLayer(t,c.hdnFldDivId);t.evntDateLyr.bind();if(!t.bNoDropDown)
{t.oTagText=t.bIsClosed?new EbayHTMLSelect(t,t.bMultiVal?(c.sMVTagTextBoxPrefix+pI):(t.bDate?'year_'+c.sTagTextBoxPrefix+pI:c.sTagTextBoxPrefix+pI)):new EbayHTMLText(t,t.bMultiVal?(c.sMVTagTextBoxPrefix+pI):((t.bDate&&!t.bYear)?'year_'+c.sTagTextBoxPrefix+pI:c.sTagTextBoxPrefix+pI));t.bIsClosed?t.oTagText._registerEvent('onchange','parent.setStatus'):t.oTagText._registerEvent('onblur','parent.setStatus');t.oTagText._registerEvent('onkeydown','parent.clearText');t.oTagText._registerEvent('onkeyup','parent.refreshAutoComplete');if(t.bDate){t.oTagText._registerEvent('onfocus','parent.checkFcsDate');t.oTagText._registerEvent('onchange','parent.checkFcsDate');t.oTagText._registerEvent('onblur','parent.checkBlrDate');t.oTagText._registerEvent('onkeyup','parent.checkDate');}
t.oTagText.bind();}
if(t.bFull||t.bPartial){t.oMon=new EbayHTMLSelect(t,t.bMultiVal?('mon_'+c.sMVTagTextBoxPrefix+pI):('mon_'+c.sTagTextBoxPrefix+pI));t.oMon.bind();t.oMon.setOption(-1,t.monTxt,-1);if(t.bFull)
t.oMon._registerEvent('onchange','parent.populateDates');if(t.bPartial)
t.oMon._registerEvent('onchange','parent.setPartialVal');if(!(t.bPartial)){t.oDay=new EbayHTMLSelect(t,t.bMultiVal?('day_'+c.sMVTagTextBoxPrefix+pI):('day_'+c.sTagTextBoxPrefix+pI));t.oDay.bind();t.oDay._registerEvent('onchange','parent.updateDates');t.oDay.setOption(-1,t.dayTxt,-1);}}
t.oDownArrow=new EbayHTMLAnchor(t,oSC.sDownArrowPrefix+pI);t.oRemove=new EbayHTMLAnchor(t,oSC.sRemovePrefix+pI);t.oCustSuggTxt=new EbayHTMLText(t,"suggCustVarTxt");t.oCustEdit=new EbayHTMLAnchor(t,oSC.sCustEditPrefix+pI);t.oCustLabel=new EbayHTMLLayer(t,"VarLabel_"+pI);t.oCustSuggLyr=new EbayHTMLLayer(t,"suggCustVarDiv");t.sCustOPTIONS='suggCustVarDiv_option_';t.oSuggestLayer=new EbayHTMLLayer(t,oSC.sTagValOptLyrPrefix+pI);t.oHiddenText=new EbayHTMLText(t,c.sHiddenParamPrefix+pI);t.oSeq=new EbayHTMLText(t,c.sTagSeqPrefix+pI);t.oHelp=new EbayHTMLAnchor(t,oSC.sHelpPrefix+pI);t.oCustDownArrow=new EbayHTMLAnchor(t,"suggCustVarImg");t.oHelp._registerEvent('onclick','parent.showHelp');t.oDownArrow._registerEvent('onclick','parent.onClickArrow');t.oRemove._registerEvent('onclick','parent.removeTag');t.oCustEdit._registerEvent('onclick','parent.editCustVarName');t.oCustDownArrow._registerEvent('onclick','parent.createCustVarSugg');t.bAutoComplete=false;t.bSecAutoComplete=false;t.bMore=att.bMore;this.init=function(pVals,pSetTagOptions,pSetChildClass)
{var t=this;with(t)
{var p=parent;u=p.oUtils;if(bIsBind)
{bindObjects();if(typeof oTagText=='undefined'||(oTagText.eElem&&oTagText.eElem.type=='hidden'))
return;if(typeof(pSetTagOptions)=='undefined'||pSetTagOptions)
((iTsrc!=p.aTsrc.customNoAutoSug&&iTsrc!=p.aTsrc.customAutoSug))?(bDate?u.setTagOptions(this,aOptions,bIsClosed,false,bDate):u.setTagOptions(this,aOptions,bIsClosed)):u.setTagOptions(this,aOptions,bIsClosed);u.setHiddenValues(t,iTname,iTsrc,iTaction,sSelVal,sValSrc);if(typeof oTagText!='undefined'){if(!oTagText.eElem)
oTagText.bind();oTagText.setValue((t.bIsClosed&&t.bMultiVal)?oTagText.getValue():sSelVal);}
if(oParentTag&&typeof(pSetChildClass)!='undefined'&&pSetChildClass)
oTagOuterLayer.setClass(oSC.sChildClass);}
else if(bDate&&!bYear){u.setTagOptions(this,aOptions,bIsClosed,false,bDate,false);if(sSelVal!=""){checkDate(true);if(sSelMonInd==0||sSelMonInd!="")
oMon.eElem.selectedIndex=sSelMonInd;if(bPartial)
updateMonth(true);if(!bPartial&&!(oMon.eElem.disabled)){populateDates(true);if(sSelDayInd!=""){oDay.eElem.selectedIndex=sSelDayInd;updateDates(true);}}}}
else if(bYear){u.setTagOptions(this,aOptions,bIsClosed,false,false,bYear);updateDates(true);}}}
this.bindObjects=function()
{var t=this;with(t)
{var p=parent;oTagOuterLayer.eElem=null;oTagNameLayer.eElem=null;oDownArrow.eElem=null;oRemove.eElem=null;if(oCustEdit&&oCustEdit.eElem)
oCustEdit.eElem=null;oHelp.eElem=null;oSuggestLayer.eElem=null;if(typeof oTagText!='undefined')
oTagText.eElem=null;oSeq.eElem=null;oHiddenText.eElem=null;p.bindObj(oTagOuterLayer);p.bindObj(oTagNameLayer);p.bindObj(oDownArrow);p.bindObj(oRemove);if(oCustEdit)
p.bindObj(oCustEdit);p.bindObj(oHelp);p.bindObj(oSuggestLayer);if(!bNoDropDown)
p.bindObj(oTagText);p.bindObj(oSeq);p.bindObj(oHiddenText);}}
this.unbindObjects=function()
{var t=this,oD=t.oDocument;if(!t.bNoDropDown)
oD.clearControl(t.oTagText.name);oD.clearControl(t.oSuggestLayer.name);oD.clearControl(t.oRemove.name);oD.clearControl(t.oDownArrow.name);oD.clearControl(t.oHelp.name);if(t.oCustEdit&&t.oCustEdit.name)
oD.clearControl(t.oCustEdit.name);}
this.checkFcsDate=function(){var t=this,p=t.parent;p.checkDate();p.updateDates(true);}
this.checkBlrDate=function(){var t=this,p=t.parent;p.checkDate();}
this.checkDate=function(pOv)
{var t=this,p=t.parent;oTagText=t.oTagText||p.oTagText;oMon=t.oMon||p.oMon;bFull=t.bFull||p.bFull;bPartial=t.bPartial||p.bPartial;Months=t.Months||p.Months;var val=oTagText.getValue();if((t.bIsClosed)||!(isNaN(val))){if(val.length==4||(t.bIsClosed&&val!="-")){if(bFull||bPartial){oMon.eElem.disabled="";oMon.eElem.disabled=false;if(oMon.getOptionsLength()<2){for(var i=0;i<12;i++)
oMon.insertOption(i,Months[i],i);}}}else{if(bFull||bPartial){oMon.eElem.disabled="disabled";oMon.eElem.disabled=true;}}}
t.updateDates?t.updateDates(pOv):p.updateDates(pOv);}
this.setPartialVal=function(){var t=this,p=t.parent;var val=p.sSelVal;var selIdx=p.oMon.getSelectedIndex();if(val){if(p&&!p.evtDateHdnTxt.eElem){p.setHdnValForTray(p);}
if(selIdx!=12){var selDay=selIdx+1,selSt=selDay.toString(),mon=(selSt.length==2)?selDay:('0'+selDay);p.evtDateHdnTxt.setValue("");if(val.length>4)
val=val.substring(0,4);p.selParDt=val+mon;p.evtDateHdnTxt.setValue(val+mon);p.sSelMonInd=selIdx;}else if(selIdx==12)
p.evtDateHdnTxt.setValue(val);}}
this.setHdnValForTray=function(p){var hn='<input type="hidden" value="" id="'+p.evtDateHdnTxt.name+'" name="'+p.evtDateHdnTxt.name+'">';p.oSuggestLayer.eElem.innerHTML+=hn;p.evtDateHdnTxt.bind();}
this.populateDates=function(pOv){var t=this,p;if(pOv==true)
p=this;else
p=t.parent;var selTxt=p.oMon.getSelectedText(),val=t.sSelVal||p.sSelVal,bLeap=false,nDays,ar1=[0,2,4,6,7,9,11];if(t.iSelIndex=="24")
p.oDay.eElem.disabled=true;if(p.oDay.eElem.length>1)
p.oDay.eElem.length=1;for(var i=0;i<12;i++){if(p.Months[i]==selTxt){p.oDay.eElem.disabled="";p.oDay.eElem.disabled=false;if(val%4==0)
bLeap=true;if(i==1&&bLeap)
nDays=29;else if(i==1)
nDays=28;else{for(var j=0;j<ar1.length;j++){if(ar1[j]==i){nDays=31;break;}}
if(typeof(nDays)=='undefined')
nDays=30;}
for(var j=1;j<=9;j++)
p.oDay.insertOption('0'+j,'0'+j,j);for(var k=0;k<nDays-9;k++){var n=k+10;p.oDay.insertOption(n,n,n);}
break;}}
var selIdx=p.oMon.getSelectedIndex();if(val){if(p&&!p.evtDateHdnTxt.eElem){p.setHdnValForTray(p);}
if(selIdx!=12){var selDay=selIdx+1,selSt=selDay.toString(),mon=(selSt.length==2)?selDay:('0'+selDay);p.evtDateHdnTxt.setValue("");if(val.length>4)
val=val.substring(0,4);p.selParDt=val+mon;p.evtDateHdnTxt.setValue(val+mon);p.sSelMonInd=selIdx;}else if(selIdx==12)
p.evtDateHdnTxt.setValue(val);}}
this.updateDates=function(pOv){var p,t=this;if((pOv==true)||t.oMon)
p=t;else
p=t.parent;var val=p.sSelVal?p.sSelVal:t.sSelVal;if(val){if(p&&!p.evtDateHdnTxt.eElem){p.setHdnValForTray(p);}
p.evtDateHdnTxt?p.evtDateHdnTxt.setValue(val):t.evtDateHdnTxt.setValue(val);if(p.oMon){var selIdx=p.oMon.getSelectedIndex();if(selIdx!=12){var selDay=selIdx+1,selSt=selDay.toString(),mon=(selSt.length==2)?selDay:('0'+selDay);p.evtDateHdnTxt.setValue("");if(val.length>4)
val=val.substring(0,4);p.selParDt=val+mon;p.evtDateHdnTxt.setValue(val+mon);p.sSelMonInd=selIdx;}else if(selIdx==12)
p.evtDateHdnTxt.setValue(val);}
if(p.oDay){var selIdxDy=p.oDay.getSelectedIndex();if(selIdxDy!=0){var selSt=selIdxDy.toString(),day=(selSt.length==2)?selIdxDy:'0'+selIdxDy;p.evtDateHdnTxt.setValue("");if(p.selParDt.length>6)
val=val.substring(0,6);p.evtDateHdnTxt.setValue(p.selParDt+day);p.sSelDayInd=selIdxDy;}else if(selIdxDy==0)
p.evtDateHdnTxt.setValue(p.selParDt);}}}
this.updateMonth=function(pOv){var p;if(pOv==true)
p=this;else
p=this.parent;var val=p.sSelVal?p.sSelVal:t.sSelVal;var selIdx=p.oMon.getSelectedIndex();if(val){if(p&&!p.evtDateHdnTxt.eElem){p.setHdnValForTray(p);}
if(selIdx!=12){var selDay=selIdx+1,selSt=selDay.toString(),mon=(selSt.length==2)?selDay:('0'+selDay);p.evtDateHdnTxt.setValue("");if(val.length>4)
val=val.substring(0,4);p.selParDt=val+mon;p.evtDateHdnTxt.setValue(val+mon);p.sSelMonInd=selIdx;}else if(selIdx==12)
p.evtDateHdnTxt.setValue(val);}}
this.showHelp=function()
{var t=this,oHS=t.oDocument.oPage.controls['help system'];{var p=ebay.oDocument.oPage.controls['seller_tags'];if(!p.oHelpPop)
{var c={};c.iWidth=500;c.iHeight=500;p.oHelpPop=new EbaySYI3HelpPopup(p,'slHelpPop',c);}
p.oHelpPop.sUrl=t.eElem.href;p.oHelpPop.show();}
return false;}
this.onClickArrow=function()
{var t=this.parent;with(t)
{parent.bindObj(oTagText);if(oTagText.eElem&&oTagText.eElem.disabled)
return;if(!bSuggestionCreated||t.parent.oConfig.bMSKU_Enh)
createSuggestions();if(!oSuggestLayer.eElem)
return;var p=parent,u=p.oUtils;p.oCurrentTag=t;u.aLayerValues=aValues;u.showSuggestions(arguments[2]);p.bLyrStatus=true;}}
this.createSuggestions=function()
{var t=this;with(t)
{parent.bindObj(oSuggestLayer);parent.bindObj(oTagText);oSuggestLayer.setValue("");if(aValues.length==0){if(bDate)
parent.oUtils.setTagOptions(this,aOptions,bIsClosed,false,bDate);else
parent.oUtils.setTagOptions(this,aOptions,bIsClosed);}
for(var i=0,l=aValues.length;i<l;i++)
parent.oUtils.createSuggestion(oSuggestLayer,sOPTIONS+i,aValues[i],i);bSuggestionCreated=true;}}
this.editCustVarName=function()
{var t=this,p=t.parent,pp=t.parent.parent,c=pp.oConfig,u=pp.oUtils;var edt_sTn=u.stripHTML(p.aTagAttr.tn);editCustomVarHTML=c.editCustomVarHTML.replaceTokens(edt_sTn);var cCfg=ebay.oDocument.getConfig('Selling.Common');c.bOnFocus=cCfg.bOnFocus;c.sStartLyrName=cCfg.sStartLyrName;pp.oOverlayTag.displayOverlay(editCustomVarHTML,pp,t);pp.oOverlayTag.oSaveButton.enable(false);pp.oCustEditCtrl={};pp.oCustEditCtrl.oHdnFld=[];pp.oCustEditCtrl.oRnFld=[];pp.oCustEditCtrl.oCustLabel=p.oCustLabel;p.oCustLabel.bind();pp.oCustEditCtrl.oCustTagCtrl=p;var len=Math.max.apply(Math,pp.oConfig.aCustTagLen);for(var x=0;x<len;x++){pp.oCustEditCtrl.oHdnFld[x]="0_"+p.pI.split("_")[0]+"_"+x;}
pp.oCustEditCtrl.oRnFld="0_"+p.pI.split("_")[0];p.oCustSuggTxt.bind();p.oCustSuggTxt.subscribeEvents("onblur","onkeyup","onkeydown");p.oCustSuggTxt.onblur=function(){this.parent.parent.oCustEditCtrl.oCustTxt=this.getValue();this.parent.parent.oOverlayTag.oSaveButton.focus(true);}
p.oCustSuggTxt.onkeydown=function(){var t=this,iKeyID=(window.event)?event.keyCode:arguments[1].keyCode,p=t.parent,pp=p.parent;with(t){if(iKeyID==13){if(getValue().length!=0){t.onkeyup();t.onblur();pp.oOverlayTag.oSaveButton.onclick();}
return false;}}}
p.oCustSuggTxt.onkeyup=function(){if(u.trim(this.getValue())!="")
this.parent.parent.oOverlayTag.oSaveButton.enable(true);else
this.parent.parent.oOverlayTag.oSaveButton.enable(false);}}
this.createCustVarSugg=function()
{var t=this,p=t.parent,pp=t.parent.parent,c=pp.oConfig,u=pp.oUtils;with(t)
{var sActClass=oSC.sActiveClass,sPassClass=oSC.sPassiveClass;p.oCustSuggLyr.bind();p.oCustSuggTxt.bind();p.oCustSuggLyr.setValue("");for(var i=0,l=c.aSuggVarNames.length;i<l;i++){p.createCustSuggestion(p.oCustSuggLyr,p.sCustOPTIONS+i,c.aSuggVarNames[i],i,p.oCustSuggTxt);}
p.createCustSuggestion(p.oCustSuggLyr,p.sCustOPTIONS+i+1,'<hr style="margin:0px 5px 0px 0px;" />',c.aSuggVarNames[i+1],p.oCustSuggTxt);p.createCustSuggestion(p.oCustSuggLyr,p.sCustOPTIONS+i+2,c.aTexts.ownname,c.aSuggVarNames[i+2],p.oCustSuggTxt);p.oCustSuggLyr.show(true);}}
this.createCustSuggestion=function(pSuggest,pLyrId,pValue,pIndex,pTagObj)
{var t=this;with(t)
{var oTag=pTagObj,val=pValue,sActClass=oSC.sActiveClass,sPassClass=oSC.sPassiveClass;if(typeof(pValue)!='undefined'){var val=pValue.replace(new RegExp("\&","g"),"&amp;");u.appendChild(pSuggest.name,val,pLyrId,'div');var oL=new EbayHTMLLayer(pSuggest,pLyrId);oL.iIndex=pIndex;oL.subscribeEvents("onclick","onmouseover","onmouseout");oL.onmouseout=function()
{var t=this;t.setClass(sPassClass);}
oL.onmouseover=function()
{var t=this;with(t)
{var p=parent.parent.parent,u=p.oUtils,oCT=oTag;setClass(oSC.sActiveClass);oCT.sSelOptionVal=this.getValue();oCT.iSelOption=iIndex;}}
oL.onclick=function()
{var t=this,p=t.parent.parent.parent,u=p.oUtils,oCT=oTag;with(oCT)
{setValue(sSelOptionVal);sSelVal=sSelOptionVal;bIsEdited=sSelVal!=sSelOptionVal;pSuggest.show();focus(true);p.oCustEditCtrl.oCustTxt=sSelOptionVal;p.oOverlayTag.oSaveButton.enable(true);}}
oL.bind();if(pValue==c.aTexts.ownname||pValue==c.aTexts.addMore)
{oL.setStyle('color','#666');}
oL.setClass(sPassClass);}}}
this.removeTag=function()
{var t=this;var p=t.parent,pp=t.parent.parent,c=pp.oConfig,u=pp.oUtils,len;with(t.parent.parent)
{if(p.aChild&&p.aChild.length>0)
{len=p.aChild.length;for(var i=0;i<len;i++)
{p.aChild[i].oRemove.onclick();iTotalSugTags--;}}
if(p.aTagAttr&&p.aTagAttr.aChild){var sfx=p.oTagOuterLayer.name.split("_");oTagOuterLayer_child=ebay.oDocument.getUIElem("TagOuterLayer_"+(parseInt(sfx[1])+1)+"_"+sfx[2]);if(oTagOuterLayer_child){u.removeChild("TagOuterLayer_"+(parseInt(sfx[1])+1)+"_"+sfx[2]);u.removeChild("Separator_"+(parseInt(sfx[1])+1)+"_"+sfx[2]);}}
if(oSugTagControls[t.parent.sTagCtrlName])
return;if(!isMSKUFlow)
{if(iTotalSugTags>=iMaxSugTag)
{var sLastChildId=u.getLastChildId(oSC.sSugSectionLyr);u.removeChild(sLastChildId);for(var k in oSugTagControls)
{if(oSugTagControls[k].oSugTag.name==sLastChildId)
delete oSugTagControls[k];}
iTotalSugTags--;}
var sSugTagId=oSC.sSugTagPrefix+iTagIndex,sSugTagName=t.parent.name,sgCtrlName=sSugTagName.replace(/\s/g,""),sSugHTML=c.sSugTagHTML.replaceTokens(sSugTagName,c.sHiddenParamPrefix+iTagIndex);var b=oTrayLayer.getStyle('visibility')=='visible';if(!b)
oTrayLayer.show(true);u.insertFirst(oSC.sSugSectionLyr,sSugHTML,sSugTagId);u.removeChild(t.parent.oTagOuterLayer.name);t.parent.bIsRemoved=true;if(c.iInitialTopTag>0)
{u.parent.controls.TopSectionLyr.bind();u.parent.controls.TopSectionLyr.focus(true);}
u.addTopTagsCount(false);oSugTagControls[sgCtrlName]=new EbaySYI3SuggestTagControl(t.parent.parent,sSugTagName,iTagIndex,1,true,t.parent.aTagAttr,c);iTotalSugTags++;u.setHiddenIndex(++iTagIndex);if(p.aChild&&p.aChild.length>0)
{len=p.aChild.length;for(i=0;i<len;i++)
{if(oSugTagControls[p.aChild[i].sTagCtrlName])
{oDocument.getUIElem(oSC.sSugSectionLyr).removeChild(oSugTagControls[p.aChild[i].sTagCtrlName].oSugTag.eElem);delete oSugTagControls[p.aChild[i].sTagCtrlName];}}}
if(oDividerLayer)
oDividerLayer.show(true);}
else
{u.removeChild(p.oTagOuterLayer.name);if(p.parent.oConfig.bMSKU_Enh){var suf=p.oTagOuterLayer.name.split("_");var prevElt=parseInt(suf[2])-1;var nextElt=parseInt(suf[2])+1;var tagnmFst="TagName_"+suf[1]+"_";var oTagName=oDocument.getUIElem(tagnmFst+nextElt);if(!oTagName)
{for(var i=nextElt;i<=ebay.oDocument.oPage.tagNameCnt;i++)
{oTagName=oDocument.getUIElem(tagnmFst+(parseInt(i)));if(oTagName)
break;}}
var oTagNamebfr=oDocument.getUIElem(tagnmFst+prevElt);if(!oTagNamebfr)
{for(var i=prevElt;i>=0;i--)
{oTagNamebfr=oDocument.getUIElem(tagnmFst+(parseInt(i)));if(oTagNamebfr)
break;}}
var oTagName_chld=oDocument.getUIElem("TagName_"+(parseInt(suf[1])+1)+"_"+(parseInt(suf[2])+1));var oSep_chld=oDocument.getUIElem("Separator_"+(parseInt(suf[1])+1)+"_"+(parseInt(suf[2])+1));if(!oTagNamebfr)
{if(oTagName)
oTagName.style.display="block";}
if(oTagName_chld&&oSep_chld){oTagName_chld.style.display="block";oSep_chld.style.display="block";oSep_chld.style.marginTop="40px";}}
var oSugCtrl=p.oSugCtrl,oSugTag=oSugCtrl.oSugTag;oSugCtrl.iTotalTopTag--;if(pp.oConfig.iMaxTagOptions!=oSugCtrl.iTotalTopTag&&oSugCtrl.oSugTag.eElem.style.display!=''){oSugCtrl.oSugTag.show(true);pp.oValueMsgLyr.show(false);}
var oTagCtrls=pp.oTagControls,oTagTxtValue=[];for(var i in oTagCtrls){if(oTagCtrls[i].oTagText&&oTagCtrls[i].oTagText.eElem)
oTagTxtValue[i]=oTagCtrls[i].oTagText.getValue();}
if(oSugCtrl.sAction==pp.aTaction.custom)
delete pp.oTagControls[p.name];if(oSugCtrl.iTotalTopTag==0&&iTotalSugTags>=pp.iMaxSugTag)
{var sLastChildId=u.getLastChildId(oSC.sSugSectionLyr);u.removeChild(sLastChildId);for(var k in oSugTagControls){if(oSugTagControls[k].oSugTag.name==sLastChildId)
delete oSugTagControls[k];}
iTotalSugTags--;}
if(oSugCtrl.iTotalTopTag==0)
{if(oSugCtrl.bIsParent)
{var html=oSugTag.eElem.innerHTML
u.addTopTagsCount(false);if(oSugCtrl.aTagAttr.aChild){u.addTopTagsCount(false);}
u.removeChild(oSugTag.name);for(var i=oSugCtrl.iLyrIndx;i<iTotalTopTags;i++)
{var sDesLyr=oSC.sDesLyrId+(i+1),sSugLyr=oSC.sVarLyr+(i+1);t.oDocument.getUIElem(oSC.sDesLyrId+i).innerHTML=t.oDocument.getUIElem(sDesLyr).innerHTML;t.oDocument.getUIElem(oSC.sVarLyr+i).innerHTML=t.oDocument.getUIElem(sSugLyr).innerHTML;}
var oCtrls=pp.oSugTagControls;for(var i in oCtrls)
{var oSug=oCtrls[i];if(oSug.bIsParent&&oSug.iLyrIndx>oSugCtrl.iLyrIndx)
{var idx=oSug.iLyrIndx-1;oSug.iLyrIndx=idx;oSug.sDesLyrId=oSC.sDesLyrId+idx;oSug.oCellLyr=new EbayHTMLLayer(oSug,oSC.sCellPrefix+idx);p.bindTagCtrl(oSug);}}
if(t.oDocument.getUIElem(oSC.sDesLyrId+iTotalTopTags))
t.oDocument.getUIElem(oSC.sDesLyrId+iTotalTopTags).innerHTML="";if(t.oDocument.getUIElem(oSC.sVarLyr+iTotalTopTags))
t.oDocument.getUIElem(oSC.sVarLyr+iTotalTopTags).innerHTML="";if(t.oDocument.getUIElem(oSC.sCellPrefix+iTotalTopTags))
t.oDocument.getUIElem(oSC.sCellPrefix+iTotalTopTags).style.display='none';if(oSugCtrl.sAction==pp.aTaction.custom)
delete oSugTag;else
{var b=pp.oTrayLayer.getStyle('visibility')=='visible';if(!b)
pp.oTrayLayer.show(true);oSugCtrl.iLyrIndx="";oSugCtrl.sDesLyrId="";oSugCtrl.oCellLyr=null;u.insertFirst(oSC.sSugSectionLyr,html,oSugTag.name);oSugTag.eElem=null;bindObj(oSugTag);iTotalSugTags++;}}
else
delete oSugTag;}
var oTagCtrls=pp.oTagControls;for(var i in oTagCtrls){oTagCtrls[i].oTagText.setValue(oTagTxtValue[i]);}
if(oSugCtrl.sAction==pp.aTaction.custom)
delete pp.oSugTagControls[oSugCtrl.name];}
return false;}}
this.bindTagCtrl=function(pSug)
{var t=this;pSug.oSugTag.eElem=null;pSug.oHiddenText.eElem=null;if(pSug.oCellLyr!=null)
{pSug.oCellLyr.eElem=null;t.parent.bindObj(pSug.oCellLyr);}
t.parent.bindObj(pSug.oSugTag);t.parent.bindObj(pSug.oHiddenText);var len=pSug.aTagCtrls.length;for(var i=0;i<len;i++)
{pSug.aTagCtrls[i].bindObjects();}
len=pSug.aChild.length;for(var i=0;i<len;i++)
{t.bindTagCtrl(pSug.aChild[i]);}}
this.setStatus=function()
{var t=this,p=t.parent,pp=p.parent,c=pp.oConfig,u=pp.oUtils,val=t.getValue();val=u.trim(val);with(p)
{sValSrc="";if(val.length>0&&val!=c.aTexts.ownValue)
{var bIsSugLayerOpen=oSuggestLayer.eElem?oSuggestLayer.getStyle('visibility').is('visible'):false;if(bIsSugLayerOpen)
return;bIsEdited=true;sSelVal=val;u.setSelValsrc(p,val);u.setHiddenValues(p,iTname,iTsrc,iTaction,sSelVal,sValSrc);u.postSOJTag();if(c.bMSKU_Enh&&p.bIsClosed&&c.aParChildMap){var i,j,aMap=c.aParChildMap,l=aMap.length;for(i=0;i<l;i++){if(aMap[i].pn==iTname){var innerMap=aMap[i].Vals,len=innerMap.length;for(j=0;j<len;j++){var chldCtrl=p.aTagAttr.aChild.tn+p.aTagAttr.idx+"_"+pIndex.split("_")[1];if(oTagText.getSelectedValue()=="-"){pp.controls[chldCtrl].aValues=innerMap[0].val;if(!p.contains(pp.controls[chldCtrl].aValues,'<hr style="margin:0px 5px 0px 0px;" />'))
pp.controls[chldCtrl].aValues.push('<hr style="margin:0px 5px 0px 0px;" />');if(!p.contains(pp.controls[chldCtrl].aValues,c.aTexts.ownname))
pp.controls[chldCtrl].aValues.push(c.aTexts.ownname);break;}
else if(oTagText.getSelectedValue()==innerMap[j].opn){pp.controls[chldCtrl].aValues=innerMap[j].val;if(!p.contains(pp.controls[chldCtrl].aValues,'<hr style="margin:0px 5px 0px 0px;" />'))
pp.controls[chldCtrl].aValues.push('<hr style="margin:0px 5px 0px 0px;" />');if(!p.contains(pp.controls[chldCtrl].aValues,c.aTexts.ownname))
pp.controls[chldCtrl].aValues.push(c.aTexts.ownname);break;}}
break;}}}}
else
{if(val==c.aTexts.ownValue)
t.setValue("");}
if(c.bMSKU_Enh&&!p.bIsClosed&&c.aParChildMap){var i,j,aMap=c.aParChildMap,l=aMap.length;for(i=0;i<l;i++){if(aMap[i].cn==iTname){var innerMap=aMap[i].Vals,len=innerMap.length;for(j=0;j<len;j++){var parCtrl=pp.controls[aMap[i].pn+(p.aTagAttr.iSortOrder-1)+"_"+p.name.split("_")[1]];var selParVal=parCtrl.oTagText.getSelectedValue();var chldCtrl=p;if(selParVal=="-"){return;}
else{if(innerMap[j].opn==selParVal){var temp=this.getValue();p.removeItem(innerMap[j].val,this.getValue());break;}}}}}}}}
this.removeItem=function(array,item){for(var i in array){if(array[i]==item){array.splice(i,1);break;}}}
this.contains=function(arr,findValue){var i=arr.length;while(i--){if(arr[i]===findValue)return true;}
return false;}
this.clearText=function()
{var iKeyID=(window.event)?event.keyCode:arguments[2].keyCode;with(this)
{if(iKeyID==13)
{if(this.parent.bMultiVal)
{this.parent.oAddBtn.onclick();return false;}}
if(iKeyID!=9)
{if(getValue()==parent.parent.oConfig.aTexts.ownValue)
{setValue("");eElem.style.color="#000000";}}
else
parent.oSuggestLayer.show(false);}}
this.refreshAutoComplete=function()
{var t=this,p=t.parent,u=p.parent.oUtils,pp=p.parent,c=pp.oConfig;t.setStyle("color","#000");pp.oCurrentTag=p;var val=p.oTagText.getValue();if(p.bMore>=c.maxValuesOnload){if((val.length==c.sMaxKeyStrokeLimit)&&(!p.bSecAutoComplete)){pp.oAjaxListner=p.setAutoCompleteData;u.requestData(c.sAJAXUrl.replaceTokens(oSC.aActionIdVals.fullVals,"",p.name,"")+'&mxtgvls='+c.sMaxItemTagValuesLimit);p.bSecAutoComplete=true;}}
else if(!p.bAutoComplete)
{pp.oAjaxListner=p.setAutoCompleteData;u.requestData(c.sAJAXUrl.replaceTokens(oSC.aActionIdVals.gradVals,"",p.name,""));p.bAutoComplete=true;}
if(p.aAutoCompleteValues.length>0)
{var v=t.getValue();v=u.trim(v);if(v==p.sCurTextVal)
return;p.sCurTextVal=v;p.oSuggestLayer.show(false);var aMatches=u.fetchMatches(v,p.aAutoCompleteValues);if(aMatches&&aMatches.length!=0)
u.createGradList(p,aMatches);}}
this.checkAutoComplete=function()
{var t=this;with(t)
{var p=parent,c=p.oConfig,u=p.oUtils;if(u.trim(oTagText.getValue())==c.aTexts.ownname||u.trim(oTagText.getValue())==c.aTexts.addMore)
{oTagText.setValue(c.aTexts.ownValue);oTagText.eElem.style.color="gray";if(bAutoComplete)
return;p.oAjaxListner=setAutoCompleteData;u.requestData(c.sAJAXUrl.replaceTokens(oSC.aActionIdVals.gradVals,"",name,""));bAutoComplete=true;}
else
oTagText.eElem.style.color="#000";}}
this.setAutoCompleteData=function(pData)
{var t=this,aData=pData.TagValList;if(t.oCurrentTag.bMultiVal)
{var aExistingValues=t.oCurrentTag.aTagVals,len,len2;for(var sTn in aData)
{len=aData[sTn].length;for(var index=0;index<len;index++)
{len2=aExistingValues.length;for(var iInd=0;iInd<len2;iInd++)
{if(aExistingValues[iInd].Val.is(aData[sTn][index]))
{aData[sTn].splice(index,1);}}}}}
p=t.oCurrentTag,u=t.oUtils,tt=t.oCurrentTag.oTagText;for(var i in aData){if(p.bDate||p.bYear){for(var d=0;d<aData[i].length;d++){if(!isNaN(aData[i][d])){aData[i][d]=aData[i][d].substring(0,4);}}}
t.oCurrentTag.aAutoCompleteValues=aData[i];}
if(p.aAutoCompleteValues.length>0)
{var v=tt.getValue();v=u.trim(v);if(v==p.sCurTextVal)
return;p.sCurTextVal=v;p.oSuggestLayer.show(false);var aMatches=u.fetchMatches(v,p.aAutoCompleteValues);if(aMatches&&aMatches.length!=0)
u.createGradList(p,aMatches);}}
t.init(t.aOptions);}

//48@@m23

function EbaySYI3SuggestTagControl(pParent,pName,pIndex,pAction,pIsBind,pTagAttr,pCfg,pIsParent)
{if(!this.objType)
this.objType="EbaySYI3SugTagControl";this.base=EbayBaseControl;this.base(pParent,pName);var t=this,c=pCfg,pI=pIndex,att=pTagAttr;t.aValues=[];t.sSelOptionVal="";if(att.bMV&&!t.parent.oTagControls[pName.replace(/\s/g,"")])
{t.aTagVals=[];var aVals=[],len=att.Vals.length;for(index=0;index<len;index++)
{if(index<c.iMaxTopTag||att.Vals[index].Sel)
t.aTagVals.push(att.Vals[index]);else
{aVals.push(att.Vals[index]);}}
att.Vals=aVals;}
t.aOptions=att.Vals;;t.sAction=pAction;t.sSelval="";t.bMultiVal=att.bMV;t.bIsClosed=att.bClosed;t.aTagAttr=att;t.sTagCtrlName=pName.replace(/\s/g,"");t.bIsParent=pIsParent;t.sTagCtrlName=t.sTagCtrlName.replace(new RegExp("'","g"),"");t.bDate=att.bDate;t.bYear=att.bYear
t.bFull=att.bFull;t.bPartial=att.bPartial;t.yearTxt=att.YearTxt;t.sSelMonInd="";t.sSelDayInd="";t.sDesLyrId=c.isMSKUFlow?oSC.sDesLyrId+t.parent.iTotalTopTags:null;t.iLyrIndx=c.isMSKUFlow?t.parent.iTotalTopTags:null;t.oPtagCtrl=null;t.sTname=pName.replace(pI,"");t.iIndex=pI;t.iIndex_child=pI+1;if(att&&att.aChild)
att.idx=t.iIndex_child;t.iTopTagIdx=0;t.iTotalTopTag=0;t.iTsrc="";t.aChild=[];t.aTagCtrls=[];t.oCellLyr=null;t.oSugTag=new EbayHTMLLayer(t,oSC.sSugTagPrefix+pI);t.oHiddenText=(c.isMSKUFlow)?new EbayHTMLText(t,c.sTagSeqPrefix+pI):new EbayHTMLText(t,c.sHiddenParamPrefix+pI);t.oSugTag.subscribeEvents('onclick');if(!c.isMSKUFlow)
t.oSugTag._registerEvent('onclick','parent.showOverlayTag');else
t.oSugTag._registerEvent('onclick','parent.showTopTag');this.init=function()
{var t=this;with(t)
{var pVals=aOptions,v,bDup=false;for(var i=0,l=pVals.length;i<l;i++)
{if(bDate||bYear){if(!isNaN(pVals[i].Val)){v=pVals[i].Val.substring(0,4);for(var j=0;j<aValues.length;j++){if(aValues[j]==v){bDup=true;break;}}
if(!bDup)
aValues[i]=(typeof(v)!='undefined')?v:pVals[i].Val;else
bDup=false;}}
else{v=pVals[i].Val;aValues[i]=v;}
if(pVals[i].Sel){sSelVal=v;var ln=pVals[i].Val.length;if(bDate&&ln>4){if(!isNaN(pVals[i].Val)){sSelMonInd=(pVals[i].Val.substring(4,6)-1);if(ln>6)
sSelDayInd=pVals[i].Val.substring(6,8);}}}}
if(bIsClosed)
{aValues.unshift("-");}
if(pIsBind)
{var p=parent,u=p.oUtils,sTsrc;p.bindObj(oSugTag);if(sAction==p.aTaction.removed)
{sTsrc=p.aTsrc.recoTop;if(!p.oTagControls[sTagCtrlName].bNoDropDown)
sSelOptionVal=p.oTagControls[sTagCtrlName].sSelOptionVal;if(bFull||bPartial){sSelMonInd=p.oTagControls[sTagCtrlName].oMon.getSelectedIndex();if(!bPartial)
sSelDayInd=p.oTagControls[sTagCtrlName].oDay.getSelectedIndex();}}
else
sTsrc=p.aTsrc.trayUnUsed;if(!p.isMSKUFlow)
u.setHiddenValues(t,name,sTsrc,sAction,sSelval,p.aSelValSrc.fromReco);else{p.bindObj(oHiddenText);oHiddenText.setValue(iTopTagIdx);}}}}
this.createTopTag=function(pHtml)
{var t=this,p=t,pp=p.parent,c=pp.oConfig,u=pp.oUtils,sTagName=p.sTagCtrlName,aVals=p.aValues;with(pp)
{var oTag=oTagControls[sTagName],idx=pp.iTagIndex,oRefNode=oTag.oParentTag?oTag.oParentTag.oTagOuterLayer:null;if(oRefNode&&!oRefNode.eElem)
oRefNode.bind();u.appendChild(c.sTopSectionLyr,pHtml,oSC.sTagOuterLyrPrefix+oTag.sSuffix,'div',oRefNode?oRefNode.eElem:null);oTag.unbindObjects();oTag.bTagInOverlay=false;oTag.aOptions=p.aOptions;oTag.init(p.aOptions,true,true);oTag.oRemove.show(!oTag.bIsRequired);if(!oTag.bNoDropDown)
oTag.oTagText.setValue(p.sSelOptionVal);if(oTag.bDate){if(t.bFull||t.bPartial){oTag.oMon.bind();if(!t.bPartial)
oTag.oDay.bind();}
if(p.sSelMonInd!="")
oTag.oMon.eElem.selectedIndex=p.sSelMonInd;if(p.sSelDayInd!="")
oTag.oDay.eElem.selectedIndex=p.sSelDayInd;}
delete oSugTagControls[sTagName];u.removeChild(p.oSugTag.name);u.addTopTagsCount(true);iTotalSugTags--;u.setHiddenIndex(pp.iTagIndex);if(oTag.oParentTag)
{var len=oTag.oParentTag.aChild.length;for(var i=0;i<len;i++)
{if(oTag.oParentTag.aChild[i].sTagCtrlName==oTag.sTagCtrlName)
oTag.oParentTag.aChild[i]=oTag;if(oTag.oParentTag.oTagText)
{var v=oTag.oParentTag.oTagText.getValue();if(v.is('-')||v=='')
{oTag.oTagText.enable(false);oTag.oTagText.setClass("disableCtrl");}}}}
if(oTag.aTagAttr.aChildren)
u.createChildTags(oTag,oTag.iChildIndex+1);if(oDividerLayer&&iTotalSugTags==0)
oDividerLayer.show(false);}}
this.showOverlayTag=function()
{var p=this.parent,pp=p.parent,u=pp.oUtils;var c=pp.oConfig,sTagName=p.sTagCtrlName,oOverlayTag=pp.oOverlayTag,aVals=p.aValues,idx=pp.iTagIndex++,iRow=0,sMultiHTML="",sAddBtnHTML="",bMV=p.bMultiVal,oTag=bMV?pp.oTagControls[sTagName]?pp.oTagControls[sTagName]:pp.oSugTagControls[sTagName]:pp.oSugTagControls[sTagName]?pp.oSugTagControls[sTagName]:pp.oTagControls[sTagName];if(bMV){var inDiv=oOverlayTag.controls["OverlayDiv_sec"];inDiv.bind();inDiv.setClass('En_SellTagOverLay_MV');oOverlayTag.setClass('En_Overlay_ST_MV');}
var sTitle=u.getIcons([p.aTagAttr.bReq])+p.name+u.getHelpIcon(p.aTagAttr.sHelpUrl,idx);oOverlayTag.displayOverlay((bMV?u.getMultiValueHTML(oTag.aTagVals,sTitle,idx,oTag):u.getTopTagHTML(idx,sTitle,false,null,oTag)),p,this);with(pp)
{var sTraySrc=(p.sAction==aTaction.removed)?aTsrc.recoTop:aTsrc.trayUsed;oTag=oTagControls[sTagName]=bMV?new EbaySYI3MultiValueControl(pp,p.name,idx,sTraySrc,true,p.aTagAttr,oTag.aTagVals,oConfig,oTag?oTag.oParentTag:null,oTag&&oTag.oParentTag?oTag.oParentTag.iChildIndex+1:0):(oTag&&oTag.aTagAttr.aChildren)?new EbaySYI3DepTagControl(pp,oTag.oParentTag,p.name,idx,sTraySrc,true,p.aTagAttr,false,oConfig,null,oTag.oParentTag?oTag.oParentTag.iChildIndex+1:0):new EbaySYI3TagControl(pp,oTag?oTag.oParentTag:null,p.name,idx,sTraySrc,true,p.aTagAttr,false,oConfig,null,oTag&&oTag.oParentTag?oTag.oParentTag.iChildIndex+1:0);oTag.bTagInOverlay=true;oTagControls[sTagName].oRemove.show(false);if(p.sSelOptionVal!=""){oTagControls[sTagName].oTagText.setValue(p.sSelOptionVal);if(p.bDate){if((p.bFull||p.bPartial)&&(p.sSelMonInd!="")){oTagControls[sTagName].oMon.eElem.disabled=false;oTagControls[sTagName].checkDate(true);oTagControls[sTagName].oMon.eElem.selectedIndex=p.sSelMonInd;if(p.bPartial)
oTagControls[sTagName].updateMonth(true);if(!p.bPartial&&(p.sSelDayInd!="")){oTagControls[sTagName].oDay.eElem.disabled=false;oTagControls[sTagName].populateDates(true);oTagControls[sTagName].oDay.eElem.selectedIndex=p.sSelDayInd;oTagControls[sTagName].updateDates(true);}}}}}}
this.showTopTag=function()
{var t=this,p=t.parent,pp=p.parent,u=pp.oUtils;if(p.bIsParent&&p.iTotalTopTag==0){var oHid=pp.oHiddenIndex;if(!oHid.eElem)
pp.bindObj(oHid);p.iIndex=pp.iTotalMSKUTag;pp.iTotalMSKUTag++;if(p.aTagAttr&&p.aTagAttr.aChild){p.iIndex_child=pp.iTotalMSKUTag;pp.iTotalMSKUTag++;}
oHid.setValue(pp.iTotalMSKUTag);}
p.createMSKUTopTag();if(pp.oConfig.iMaxTagOptions==p.iTotalTopTag){p.oSugTag.show(false);pp.oValueMsgLyr.show(true);}}
this.createMSKUTopTag=function()
{var t=this,p=t.parent,iIndex=t.iIndex,idx=iIndex+"_"+t.iTopTagIdx,sTagName=t.sTname,oTag=p.oTagControls[sTagName],u=p.oUtils,aVals=p.aValues,sTagCtlName=sTagName+idx,att=t.aTagAttr,att_child=t.aTagAttr.aChild,oHid=t.oHiddenText;if(typeof oSuggestControl!="undefined"&&oSuggestControl.oCustEditCtrl){sTagName=t.sTname=att.tn;sTagCtlName=sTagName+idx;}
if(t.aTagAttr&&t.aTagAttr.aChild){idx_child=t.iIndex_child+"_"+t.iTopTagIdx;}
with(p)
{var sTraySrc=(t.sAction==aTaction.custom)?t.iTsrc:(t.sAction==aTaction.removed)?aTsrc.recoTop:aTsrc.trayUsed,html;if(t.iTotalTopTag==0)
{var sVarLyr=t.bIsParent?oSC.sVarLyr+p.iTotalTopTags:oSC.sVarLyr+iIndex,oSugTag=p.oDocument.getUIElem(t.oSugTag.name);if(c.sSugTag_Chld&&t.aTagAttr&&t.aTagAttr.aChild){var sSugHTML=c.sSugTag_Chld.replaceTokens(sTagName+"/ "+t.aTagAttr.aChild.tn,c.sTagSeqPrefix+iIndex,c.sTagSeqPrefix+t.iIndex_child);t.aTagAttr.idx=t.iIndex_child;var parChldRelHTML=c.sParChldHdnRel.replaceTokens("0_"+iIndex,"vt_tseq_"+"0_"+t.iIndex_child,"0_"+t.iIndex_child,"vt_tseq_"+"0_"+iIndex);t.aTagAttr.parChldRel=parChldRelHTML;t.aTagAttr.bParChldRel=false;if(t.aTagAttr.parChldRel&&t.aTagAttr.parChldRel!=''&&!t.aTagAttr.bParChldRel){u.appendChild(sVarLyr,t.aTagAttr.parChldRel,'','div');t.aTagAttr.bParChldRel=true;}}else{if(sTagName.contains(">")||sTagName.contains(">"))
var sSugHTML=c.sSugTagHTML.replaceTokens(escapeHTMLCode(sTagName),c.sTagSeqPrefix+iIndex);else
var sSugHTML=c.sSugTagHTML.replaceTokens(sTagName,c.sTagSeqPrefix+iIndex);}
oHid=t.oHiddenText=new EbayHTMLText(t,c.sTagSeqPrefix+iIndex);t.sDesLyrId=t.bIsParent?oSC.sDesLyrId+p.iTotalTopTags:oSC.sDesLyrId+pI;t.iLyrIndx=p.iTotalTopTags;if(t.sAction!=aTaction.custom&&t.bIsParent)
{u.removeChild(t.oSugTag.name);t.oSugTag.eElem=null;t.oHiddenText.eElem=null;}
u.appendChild(sVarLyr,sSugHTML,t.oSugTag.name,'div');if(t.bIsParent)
{var sCellId=oSC.sCellPrefix+p.iTotalTopTags;t.oCellLyr=new EbayHTMLLayer(t,sCellId);bindObj(t.oCellLyr);t.oCellLyr.show(true);u.addTopTagsCount(true);if(t.aTagAttr&&t.aTagAttr.aChild)
u.addTopTagsCount(true);}
bindObj(t.oSugTag);bindObj(t.oHiddenText);}
if(c.bMSKU_Enh)
var sActn=t.iTotalTopTag;else
var sActn=null;html=t.bIsClosed?(t.aTagAttr&&t.aTagAttr.aChild)?u.getTopTagHTML(idx,sTagName,false,false,t,null,idx_child,null,null,sActn):u.getTopTagHTML(idx,sTagName,false,false,t,null,null,null,null,sActn):t.aTagAttr.bCustomTag?u.getTopTagHTML(idx,sTagName,false,null,null,null,null,true,null,sActn):(t.aTagAttr&&t.aTagAttr.aChild)?u.getTopTagHTML(idx,sTagName,false,null,null,null,idx_child,null,t.aTagAttr,sActn):u.getTopTagHTML(idx,sTagName,false,null,null,null,null,null,null,sActn);u.appendChild(t.sDesLyrId,html,oSC.sTagOuterLyrPrefix+idx,'div');if(att.aChildren)
u.createMSKUChildTags(t,idx);oTag=oTagControls[sTagCtlName]=(t.aTagAttr.aChildren)?new EbaySYI3DepTagControl(p,p,sTagCtlName,idx,sTraySrc,true,t.aTagAttr,false,oConfig,t,(oTag&&oTag.oParentTag)?oTag.oParentTag.iChildIndex+1:0):new EbaySYI3TagControl(p,oTag?oTag.oParentTag:null,sTagCtlName,idx,sTraySrc,true,t.aTagAttr,false,oConfig,t,oTag&&oTag.oParentTag?oTag.oParentTag.iChildIndex+1:0);if(t.aTagAttr&&t.aTagAttr.aChild){new EbaySYI3TagControl(p,oTag?oTag.oParentTag:null,t.aTagAttr.aChild.tn+idx_child,idx_child,sTraySrc,true,t.aTagAttr.aChild,false,oConfig,t,oTag&&oTag.oParentTag?oTag.oParentTag.iChildIndex+1:0);}
t.iTopTagIdx++;t.iTotalTopTag++;ebay.oDocument.oPage.tagNameCnt++;t.aTagCtrls.push(oTag);if(t.oPtagCtrl!=null&&!t.bIsParent)
t.oPtagCtrl.aChild.push(oTag);if(!oHid.eElem)
bindObj(oHid);oHid.setValue(t.iTopTagIdx);if(t.aTagAttr&&t.aTagAttr.aChild){oHid_Chld=new EbayHTMLText(t,c.sTagSeqPrefix+t.iIndex_child);if(!oHid_Chld.eElem)
bindObj(oHid_Chld);oHid_Chld.setValue(t.iTopTagIdx);}
if(!att.aChildren&&t.iTotalTopTag==1){t.oSugTag.onclick();iTotalSugTags--;}}}
this.init();}

//49@@m22

function EbaySYI3CustomTagControl(pParent,pName,pIndex,pCfg)
{if(!this.objType)
this.objType="EbaySYI3CustomTagControl";this.base=EbayBaseControl;this.base(pParent,pName);var t=this,c=pCfg,pI=pIndex;t.iIndex=pI;t.aValues=[];t.aAutoCompleteValues=[];t.sOPTIONS=oSC.sTagValOptLyrPrefix+pI+'_NameOption_';t.bSuggestionCreated=false;t.iSelOption=0;t.sSelOptionVal="";t.sCurTextVal="";t.sSelVal="";t.iTname="";t.iTsrc="";t.iTaction=pParent.aTaction.none;t.sValSrc="0";t.iTags=pParent.iTotalTopTags;t.oOuterLyr=new EbayHTMLLayer(t,oSC.sCustomOuterLyr+pI);t.oNameTexBox=new EbayHTMLText(t,oSC.sCustomNamePrefix+pI);t.oValueTexBox=new EbayHTMLText(t,c.sTagTextBoxPrefix+pI);t.oRemoveLnk=new EbayHTMLAnchor(t,oSC.sCustomRemovePrefix+pI);t.oSugNameLyr=new EbayHTMLLayer(t,oSC.sCusSugNamePrefix+pI);t.oSugValLyr=new EbayHTMLLayer(t,oSC.sCusSugValPrefix+pI);t.oWarnMsgLyr=new EbayHTMLLayer(t,oSC.sCustomWarnPrefix+pI);t.oHiddenText=new EbayHTMLText(t,c.sHiddenParamPrefix+pI);if(c.bMSKU_Enh&&c.aAddVarDivs){oCustomChkBox=t.oCustomChkBox=new Array();oAddVarDiv=t.oAddVarDiv=new Array();for(var x=0;x<c.aAddVarLen;x++){t.oCustomChkBox[x]=new EbayHTMLCheckbox(t,"chk"+x);t.oAddVarDiv[x]=new EbayHTMLLayer(t,c.aAddVarDivs["chk"+x][2].tid);}
oAddOwnChkBox=t.oAddOwnChkBox=new EbayHTMLCheckbox(t,"yourOwn");oCustLyr=t.oCustLyr=new EbayHTMLLayer(t,"CustomDivId");t.oCustLyr.bind();}
t.oSuggestLayer=t.oTagText=null;this.init=function()
{var t=this,p=t.parent,c=p.oConfig;with(t)
{oRemoveLnk._registerEvent('onclick','parent.removeCustomTag');oNameTexBox._registerEvent('onkeyup','parent.showGradNames');oNameTexBox._registerEvent('onblur','parent.getGradVals');oNameTexBox._registerEvent('onfocus','parent.clearText');if(c.bMSKU_Enh&&c.aAddVarDivs){for(var x=0;x<c.aAddVarLen;x++){oCustomChkBox[x]._registerEvent('onclick','parent.enableSave');}
oAddOwnChkBox._registerEvent('onclick','parent.showHideCustomLyr');}
oValueTexBox._registerEvent('onfocus','parent.clearText');oValueTexBox._registerEvent('onkeydown','parent.clearText');if(p.oConfig.isMSKUFlow||p.oConfig.bISFlow){oNameTexBox._registerEvent('onkeydown','parent.clearText');}
if(p.oConfig.bAutoCompleteEnabled)
oValueTexBox._registerEvent('onkeyup','parent.showGradVals');bindCusObj();}}
this.bindCusObj=function()
{var t=this;with(t)
{var p=parent;p.bindObj(oOuterLyr);p.bindObj(oNameTexBox);p.bindObj(oValueTexBox);p.bindObj(oRemoveLnk);p.bindObj(oSugNameLyr);p.bindObj(oSugValLyr);p.bindObj(oWarnMsgLyr);p.bindObj(oHiddenText);if(p.oConfig.bMSKU_Enh&&p.oConfig.aAddVarDivs){for(var x=0;x<p.oConfig.aAddVarLen;x++){p.bindObj(oCustomChkBox[x]);p.bindObj(oAddVarDiv[x]);}
p.bindObj(oAddOwnChkBox);}}}
this.unbindCusObj=function()
{var t=this;with(t)
{var oD=oDocument;oD.clearControl(oOuterLyr.name);oD.clearControl(oNameTexBox.name);oD.clearControl(oValueTexBox.name);oD.clearControl(oRemoveLnk.name);oD.clearControl(oSugNameLyr.name);oD.clearControl(oSugValLyr.name);oD.clearControl(oWarnMsgLyr.name);oD.clearControl(oHiddenText.name);if(this.parent.oConfig.bMSKU_Enh&&this.parent.oConfig.aAddVarDivs){for(var x=0;x<p.oConfig.aAddVarLen;x++){oD.clearControl(oCustomChkBox[x]);oD.clearControl(oAddVarDiv[x]);}
oD.clearControl(oAddOwnChkBox.name);}}}
this.clearText=function()
{var t=this,iKeyID=(window.event)?event.keyCode:arguments[2].keyCode,p=t.parent,pp=p.parent;with(t)
{if(iKeyID!=9)
{if(getValue()==parent.parent.oConfig.aTexts.ownValue||getValue()==parent.parent.oConfig.aTexts.customName||getValue()=="")
{setValue("");eElem.style.color="#000000";}}
else
{parent.oSugNameLyr.show(false);parent.oSugValLyr.show(false);}
if(iKeyID==13&&(parent.parent.oConfig.isMSKUFlow||parent.parent.oConfig.bISFlow)){if(!pp.oOverlayTag.oSaveButton.bDisabled&&getValue().length!=0&&p.oValueTexBox.getValue()!=parent.parent.oConfig.aTexts.ownValue){t.onblur();if(p.oWarnMsgLyr.eElem.style.display!='')
pp.oOverlayTag.oSaveButton.onclick();}
else{t.onblur();if(getValue().length!=0)
pp.oOverlayTag.oSaveButton.onclick();}
return false;}}}
this.showGradNames=function()
{var t=this,p=t.parent,pp=p.parent,u=pp.oUtils,v=t.getValue(),aGradList=[];v=u.trim(v);if(v==p.sCurTextVal)
return;p.sCurTextVal=v;p.sOPTIONS=oSC.sTagValOptLyrPrefix+pI+'_NameOption_';if(pp.aGradNames.length>0)
{var a=pp.aGradNames,len=a.length;for(var i=0;i<len;i++)
{if(pp.isMSKUFlow){if(!pp.oTagControls[a[i].replace(/\s/g,"")+i]&&!pp.oSugTagControls[a[i].replace(/\s/g,"")+i])
aGradList[aGradList.length]=a[i];}
else if(!pp.oTagControls[a[i].replace(/\s/g,"")]&&!pp.oSugTagControls[a[i].replace(/\s/g,"")])
aGradList[aGradList.length]=a[i];}}
if(aGradList.length>0)
{pp.oCurrentTag=p;var aMatches=u.fetchMatches(v,pp.aGradNames);p.oSuggestLayer=p.oSugNameLyr;p.oSuggestLayer.show(false);p.oTagText=t;if(aMatches&&aMatches.length!=0)
{p.aValues=aMatches;u.createGradList(p,aMatches);}}
if(pp.isMSKUFlow){if(v.length==0)
pp.oOverlayTag.oSaveButton.enable(false);else
pp.oOverlayTag.oSaveButton.enable(true);}}
this.enableSave=function()
{var t=this,p=t.parent,pp=p.parent;for(var x=0;x<pp.oConfig.aAddVarLen;x++){if(this.isChecked()){p.iTags++;break;}
if(!this.isChecked()){p.iTags--;break;}}
if(p.iTags){pp.oOverlayTag.oSaveButton.enable(true);}
else{pp.oOverlayTag.oSaveButton.enable(false);}
for(var x=0;x<pp.oConfig.aAddVarLen;x++){if(p.iTags>=5){if(!p.oCustomChkBox[x].isChecked()&&p.oCustomChkBox[x].eElem){p.oCustomChkBox[x].eElem.disabled=true;p.oAddOwnChkBox.eElem.disabled=true;}}else{if(p.oCustomChkBox[x].eElem)
p.oCustomChkBox[x].eElem.disabled=false;p.oAddOwnChkBox.eElem.disabled=false;}}}
this.showHideCustomLyr=function(){var t=this,p=t.parent,pp=p.parent,bEnable=false;if(p.oAddOwnChkBox.isChecked()){p.oCustLyr.show(true);bEnable=true;p.iTags++;}else{p.oCustLyr.show();p.iTags--;}
if(pp.oConfig.bMSKU_Enh&&pp.oConfig.aAddVarLen){for(var x=0;x<pp.oConfig.aAddVarLen;x++){if(p.iTags>=5){if(p.oAddOwnChkBox.isChecked()&&p.oCustomChkBox[x].eElem&&!p.oCustomChkBox[x].isChecked()){p.oCustomChkBox[x].eElem.disabled=true;}}else{if(p.oCustomChkBox[x].eElem)
p.oCustomChkBox[x].eElem.disabled=false;p.oAddOwnChkBox.eElem.disabled=false;}}}}
this.showGradVals=function()
{var t=this,p=t.parent,pp=p.parent,u=pp.oUtils,v=t.getValue();v=u.trim(v);if(v==p.sCurTextVal)
return;p.sCurTextVal=v;p.sOPTIONS=oSC.sTagValOptLyrPrefix+pI+'_ValOption_';if(p.aAutoCompleteValues.length>0)
{pp.oCurrentTag=p;var aMatches=u.fetchMatches(v,p.aAutoCompleteValues);p.oSuggestLayer=p.oSugValLyr;p.oSuggestLayer.show(false);p.oTagText=t;if(aMatches&&aMatches.length!=0)
{p.aValues=aMatches;u.createGradList(p,aMatches);}}}
this.getGradVals=function()
{var t=this,p=t.parent,pp=p.parent,u=pp.oUtils,c=pp.oConfig,val=t.getValue();val=u.trim(val);with(p)
{if(oValueTexBox.getValue()==c.aTexts.ownValue)
oValueTexBox.setValue("");if(val!=""&&val!=c.aTexts.customName)
{iTname=val;for(var i in pp.oTagControls)
{var iTn=pp.oTagControls[i].iTname;if(iTn.contains(">")||iTn.contains(">"))
val=unescapeHTMLCode(val);else
val=escapeHTMLCode(val);if(iTn.toLowerCase()==val.toLowerCase()&&!pp.oTagControls[i].bIsRemoved)
{t.setValue("");oWarnMsgLyr.setValue(c.aTexts.warnmsg);oWarnMsgLyr.show(true);if(pp.isMSKUFlow)
{if(t.getValue().length==0)
pp.oOverlayTag.oSaveButton.enable(false);else
pp.oOverlayTag.oSaveButton.enable(true);}
return;}}
for(var i in pp.oCustomControls)
{var sTxtVal=pp.oCustomControls[i].oNameTexBox.getValue().toLowerCase();if(i!=t.parent.name&&sTxtVal!=c.aTexts.customName.toLowerCase()&&sTxtVal!=c.aTexts.ownValue.toLowerCase()&&sTxtVal==val.toLowerCase())
{t.setValue("");oWarnMsgLyr.show(true);oWarnMsgLyr.setValue(c.aTexts.warnmsg);if(pp.isMSKUFlow)
{if(t.getValue().length==0)
pp.oOverlayTag.oSaveButton.enable(false);else
pp.oOverlayTag.oSaveButton.enable(true);}
return;}}
for(var i in pp.oSugTagControls){var iTn=pp.oSugTagControls[i].sTname;if(iTn.toLowerCase()==val.toLowerCase()&&!pp.oSugTagControls[i].bIsRemoved)
{t.setValue("");oWarnMsgLyr.setValue(c.aTexts.warnmsg);oWarnMsgLyr.show(true);if(pp.isMSKUFlow)
{if(t.getValue().length==0)
pp.oOverlayTag.oSaveButton.enable(false);else
pp.oOverlayTag.oSaveButton.enable(true);}
return;}}
iTsrc=u.oUtils.isInArray(pp.aGradNames,val)?pp.aTsrc.customAutoSug:pp.aTsrc.customNoAutoSug;sCurTextVal=oValueTexBox.getValue();u.setHiddenValues(p,iTname,iTsrc,iTaction,sSelVal,sValSrc);if(c.bAutoCompleteEnabled&&val!=pp.sSpellOriginalValue)
{pp.oCurrentTag=p;pp.oAjaxListner=processGradVals;u.requestData(c.sAJAXUrl.replaceTokens(oSC.aActionIdVals.gradVals,"",val,""));}
if(val!=pp.sSpellSugValue)
{pp.oSpellUOM=oSugNameLyr;pp.oSpellUOMParent=t;pp.SpellUOMCheckId=oSC.sSpellUOMPrefix+t.name;}}
else
{if(pp.isMSKUFlow)
{pp.oOverlayTag.oSaveButton.enable(false);t.setValue("");return;}
t.setValue("");}
pp.oOverlayTag.oSaveButton.enable(true);oWarnMsgLyr.show(false);}}
this.processGradVals=function(pData)
{var t=this,aData=pData.TagValList;for(var i in aData)
t.oCurrentTag.aAutoCompleteValues=aData[i];}
this.removeCustomTag=function()
{var t=this,p=t.parent.parent;u=p.oUtils;var sLyrId=t.parent.oOuterLyr.name;with(p)
{u.removeChild(sLyrId);delete oCustomControls[sLyrId];delete p.oCustomControls[t.parent.name];u.addTopTagsCount(false);var oAddAnch=p.controls['AddCustomLnk'].eElem;if(oAddAnch&&oAddAnch.nodeName=="A")
oAddAnch.focus(true);}}
this.showSpellCheckUOM=function()
{var t=this,p=t.parent.parent,c=p.oConfig,u=p.oUtils,val=t.getValue();val=u.trim(val);with(t.parent)
{if(val!=""&&val!=c.aTexts.ownValue)
{u.setSelValsrc(t.parent,val);u.setHiddenValues(t.parent,iTname,iTsrc,iTaction,sSelVal,sValSrc);if(val!=p.sSpellSugValue)
{p.oSpellUOM=oSugValLyr;p.oSpellUOMParent=t;p.SpellUOMCheckId=oSC.sSpellUOMPrefix+t.name;if(val!=p.sSpellOriginalValue&&c.bSpellCheckUOMEnabled&&sValSrc==p.aSelValSrc.manualNoAuto)
{p.sSpellOriginalValue=val;p.sSpellSugValue="";p.aSpellUOMResponse="";p.oAjaxListner=u.getSpellUOMChecks;}
else if(val==p.sSpellOriginalValue&&p.aSpellUOMResponse!="")
u.getSpellUOMChecks(p.aSpellUOMResponse);}}
else
t.setValue("");}}
this.init();}

//50@@m55

function escapeHTMLCode(str){str=str.replace(/&/g,"&amp;");str=str.replace(/</g,"&lt;");str=str.replace(/>/g,"&gt;");return str;}
function unescapeHTMLCode(str){str=str.replace(/&amp;/g,"&");str=str.replace(/&lt;/g,"<");str=str.replace(/&gt;/g,">");return str;}
function EbaySYI3SellerTagUtils(pParent,pName)
{if(!this.objType)
this.objType="EbaySYI3SellerTagUtils";this.base=EbayBaseControl;this.base(pParent,pName);var t=this;t.sCurTagName="";t.aLayerValues=[];t.sMVContainer='mvContainer';t.bShowProgress=false;t.bUKAutos=(typeof(pParent.oConfig.bUKAutos)!='undefined')?pParent.oConfig.bUKAutos:false;this.requestData=function(pUrl)
{var t=this;if(t.bShowProgress)
t.showProgress();var p=t.parent.oConfig;var sUrl=pUrl;if(p.supList)
sUrl+='&'+oSC.sSuppresParam+'='+p.supList;if(p.varList)
sUrl+='&'+oSC.sVarTaginfoParam+'='+p.varList;if(t.bUKAutos){sUrl+='&responseformat=2&callback=processDataResponse';var head=document.getElementsByTagName("head")[0];var script=document.createElement("script");script.setAttribute("type","text/javascript");script.setAttribute("src",sUrl);head.appendChild(script);window['processDataResponse']=Function("resp","ebay.oDocument.oPage.controls['seller_tags'].controls['seller_tag_utils'].processDataResponse(resp);");}else{var req=ebay.oServer.createRequest('seller_tag',sUrl,true);req.sPostData="";req.iResponseType=3;req.registerAsDataListener(t);req.send();}}
this.processDataResponse=function(pResp)
{var t=this;var resp=t.bUKAutos?pResp:pResp.oJSON;if(resp)
t.parent.oAjaxListner(resp);if(t.bShowProgress)
t.hideProgress();}
this.showProgress=function()
{var t=this;with(t)
{var p=parent,oP=p.parent,c=p.oConfig,gLyr=oP.controls['grayout_lyr'];if(gLyr)
{var e=oDocument.getUIElem('ItemSpecifics'),iLocs=oUtils.oPositioning.getOffsetLeftTop(e);if(document.body.style.overflow=='hidden')
{var ge=oDocument.getUIElem('lyrGrayout_sec'),gePrt=ge.parentElement?ge.parentElement:ge.parentNode,cLyr=oDocument.getUIElem('content');if(gePrt.id!='content')
{gePrt.removeChild(ge);cLyr.appendChild(ge);}}
gLyr.bDisableSelElems=false;gLyr.display(e.scrollWidth,e.scrollHeight,iLocs);var oProgLyr=oDocument.getUIElem(oSC.sProgressIndicator)
if(oProgLyr)
gLyr.oLayer.setValue(oProgLyr.innerHTML);}}}
this.hideProgress=function()
{var t=this;t.parent.parent.controls['grayout_lyr'].hide();t.bShowProgress=false;}
this.removeChild=function(pChildId)
{var t=this;if(pChildId=="")return;var oChild=t.oDocument.getUIElem(pChildId),oP;if(!oChild)
return;oP=oChild.parentNode;if(oP)
oP.removeChild(oChild);}
this.appendChild=function(pParentId,pChildHTML,pChildId,pChildType,pRefNode,pChildClass)
{var t=this;if(pParentId=="")return;var oD=t.oDocument,oP=oD.getUIElem(pParentId),c=t.parent.oConfig;if(oP)
{var oChildTag=oD.createElement(pChildType);oChildTag.innerHTML=pChildHTML;oChildTag.id=pChildId;oChildTag.setAttribute('role','option');if(typeof pChildClass!='undefined')
oChildTag.className=pChildClass;if(pRefNode)
t.insertAfter(oChildTag,pRefNode);else
oP.appendChild(oChildTag);}}
this.insertFirst=function(pParentId,pChildHTML,pChildId)
{var t=this;if(pParentId==""||pChildId=="")return;var oD=t.oDocument,oP=oD.getUIElem(pParentId);if(oP)
{var oChildTag=oD.createElement("div"),oFirstChild=oP.firstChild,c=t.parent.oConfig;if(!oFirstChild)
{t.appendChild(pParentId,pChildHTML,pChildId,'div',null,c.sSugTagOuterClass);return;}
while(oFirstChild.nodeType==3)
{oFirstChild=oFirstChild.nextSibling;if(!oFirstChild)
{t.appendChild(pParentId,pChildHTML,pChildId,'div');return;}}
oChildTag.innerHTML=pChildHTML;oChildTag.id=pChildId;oChildTag.className=c.sSugTagOuterClass;oP.insertBefore(oChildTag,oFirstChild);}}
this.insertAfter=function(pNewNode,pRefNode)
{var oPN=pRefNode.parentNode?pRefNode.parentNode:pRefNode.parentElement;oPN.insertBefore(pNewNode,pRefNode.nextSibling);}
this.getLastChildId=function(pParentId)
{var t=this;if(pParentId=="")return;var oD=t.oDocument,oP=oD.getUIElem(pParentId),oLastChild=oP?oP.lastChild:null;if(!oLastChild)
return null;while(oLastChild.id=="")
oLastChild=oLastChild.previousSibling;if(oLastChild)
return oLastChild.id;return null;}
this.getHelpIcon=function(pHelp,pIndex)
{var t=this,c=t.parent.oConfig,helpHTML="",helpDiv=t.oDocument.createElement('div');if(pHelp)
{oHelpLink=t.oDocument.createElement('a');oHelpLink.href=pHelp;oHelpLink.id=oHelpLink.name="Help_"+pIndex;oHlpImg=t.oDocument.createElement('img');oHlpImg.src=c.sHelpImg;oHlpImg.setAttribute('border','0');oHlpImg.setAttribute('alt',' ');oHelpLink.appendChild(oHlpImg);helpDiv.appendChild(oHelpLink)
oHelpLink.style.marginLeft='7px';helpHTML=helpDiv.innerHTML;}
return helpHTML;}
this.getIcons=function(pArray)
{var t=this,c=t.parent.oConfig,iconHTML="",iconDiv=t.oDocument.createElement('div'),len=pArray.length;for(var i=0;i<len;i++)
{if(pArray[i])
{icon=t.oDocument.createElement('img');icon.src=c.aIconArray[i];icon.style.marginRight='7px';icon.setAttribute('alt',' ');iconDiv.appendChild(icon);}}
iconHTML=iconDiv.innerHTML;return iconHTML;}
this.getTagTitle=function(pIndex,pName,pCustom,pRemove,pChildName,pParentChild)
{var t=this,c=t.parent.oConfig,idx=pIndex;for(var i=0;i<c.aTags.length;i++)
if(c.aTags[i].tn==pName)
{var bMV=c.aTags[i].bMV;break;}
if(bMV)
var s=c.sTagTitle.replaceTokens(pName,oSC.sRemovePrefix+pIndex,c.sMVTagTextBoxPrefix+pIndex);else if(c.sCustomTagTitle&&pCustom)
var s=c.sCustomTagTitle.replaceTokens(pName,c.sTagTextBoxPrefix+pIndex,"Edit_"+pIndex,"VarLabel_"+pIndex);else if(pParentChild&&pRemove){if(pName=='Color')
var s=c.sTagTitle_parChild2.replaceTokens(pName,pChildName);else if(pName=='Metal')
var s=c.sTagTitle_parChild3.replaceTokens(pName,pChildName);else
var s=c.sTagTitle_parChild1.replaceTokens(pName,pChildName);}
else if(c.sTagTitle1&&pRemove)
var s=c.sTagTitle1.replaceTokens(escapeHTMLCode(pName));else
var s=c.sTagTitle.replaceTokens(pName,oSC.sRemovePrefix+pIndex,((c.aTags[i]&&c.aTags[i].bDate)?'year_'+c.sTagTextBoxPrefix+pIndex:c.sTagTextBoxPrefix+pIndex));return s;}
this.getOptions=function(pValues)
{var s="",len=pValues.length;for(var i=0;i<len;i++)
{if(typeof(pValues[i])!='undefined'){var val=pValues[i].replace(new RegExp("\"","g"),"&quot;");s+='<option value="'+val+'">'+pValues[i]+'</option>';}}
return s;}
this.getTopTagHTML=function(pIndex,pName,pAddBtnId,pChildId,pObj,pNoDDown,pIndex1,pCustomTag,pSuggTagCtrl,pAction)
{var t=this;if(pObj)
var bClosed=pObj.bClosed?pObj.bClosed:pObj.bIsClosed;var c=t.parent.oConfig,idx=pChildId&&pChildId>0?pIndex+'_'+pChildId:pIndex,sTopHtml,selectHTML=c.sSelectHTML;if(!(c.isVariation)&&c.isValRecom)
{sTopHtml=((pObj.aTagAttr)?pObj.aTagAttr.Vals.length==0:pObj.aValues.length==0)?c.sTopImglessHTML:c.sTopTagHTML;}
else
{if(pObj&&pObj.aTagAttr.bParent)
{if(pObj.aTagAttr.bDisable)
selectHTML=c.sSelectHTML_pDis;else if(pObj.aTagAttr.aChild.bDisable)
selectHTML=c.sSelectHTML_cDis;else{if(pName=='Color')
selectHTML=c.sSelectHTML_parChild2;else
selectHTML=c.sSelectHTML_parChild1;}}else{if(c.bMSKU_Enh&&c.isVariation){if(bClosed){selectHTML=c.sSelectHTML1;}else{if(pSuggTagCtrl&&pSuggTagCtrl.bParent){if(pName=='Color')
sTopHtml=c.sTopTagHTML_parChild2;else
sTopHtml=c.sTopTagHTML_parChild1;}
else
sTopHtml=c.sTopTagHTML1;}}
else{sTopHtml=c.sTopTagHTML;}}}
var s='';if(pObj&&!pNoDDown&&selectHTML)
var sSelectHTML=(!(c.isVariation)&&c.isValRecom)?selectHTML.replaceTokens(pAddBtnId?c.sMVTagTextBoxPrefix+idx:(pObj.bDate?'year_'+c.sTagTextBoxPrefix+idx:c.sTagTextBoxPrefix+idx),t.getOptions(pObj.aValues),(pAddBtnId&&!pNoDDown)?t.getAddTagBtn(t.sMVContainer+idx+"_add",bClosed):"",pAddBtnId?"PaddingTop":"DropDownPadding",(pObj.aTagAttr&&!pObj.oContainer&&!pObj.bMultiVal)?pObj.aTagAttr.hlpTxt:((!pObj.bMV&&!pObj.aTagAttr)?pObj.hlpTxt:"")):(pObj&&pObj.aTagAttr.bParent)?selectHTML.replaceTokens(pAddBtnId?c.sMVTagTextBoxPrefix+idx:(pObj.bDate?'year_'+c.sTagTextBoxPrefix+idx:c.sTagTextBoxPrefix+idx),t.getOptions(pObj.aValues),(pAddBtnId&&!pNoDDown)?t.getAddTagBtn(t.sMVContainer+idx+"_add",bClosed):"",pAddBtnId?"PaddingTop":"DropDownPadding",c.sTagTextBoxPrefix+pIndex1,50,21,oSC.sDownArrowPrefix+pIndex1,oSC.sTagValOptLyrPrefix+pIndex1,c.sHiddenParamPrefix+pIndex1,"Remove_"+idx):c.bMSKU_Enh&&c.isVariation?selectHTML.replaceTokens(pAddBtnId?c.sMVTagTextBoxPrefix+idx:(pObj.bDate?'year_'+c.sTagTextBoxPrefix+idx:c.sTagTextBoxPrefix+idx),t.getOptions(pObj.aValues),(pAddBtnId&&!pNoDDown)?t.getAddTagBtn(t.sMVContainer+idx+"_add",bClosed):"",pAddBtnId?"PaddingTop":"DropDownPadding","Remove_"+idx):selectHTML.replaceTokens(pAddBtnId?c.sMVTagTextBoxPrefix+idx:(pObj.bDate?'year_'+c.sTagTextBoxPrefix+idx:c.sTagTextBoxPrefix+idx),t.getOptions(pObj.aValues),(pAddBtnId&&!pNoDDown)?t.getAddTagBtn(t.sMVContainer+idx+"_add",bClosed):"",pAddBtnId?"PaddingTop":"DropDownPadding");if(pObj){var sMargin=pAddBtnId?'':pObj&&pObj.oParentTag?' style="margin-top:5px;position:relative;"':' style="margin-top:7px; clear:both;"';var sMargin_hide=pAddBtnId?'':pObj&&pObj.oParentTag?' style="margin-top:5px;position:relative;"':' style="margin-top:7px; clear:both;display:none;"';if(!c.bMSKU_Enh&&!(pObj&&pObj.aTagAttr.bParent))
s+='<div id="'+oSC.sTagNameLyrPrefix+idx+'"'+sMargin+'>';if(pName){if(pObj&&pObj.aTagAttr.bParent){if(pAction==0){s+='<div id="'+oSC.sTagNameLyrPrefix+idx+'"'+sMargin+'>';s+=t.getTagTitle(idx,pName,null,true,pObj.aTagAttr.aChild.tn,true);}else{s+='<div id="'+oSC.sTagNameLyrPrefix+idx+'"'+sMargin_hide+'>';s+=t.getTagTitle(idx,pName,null,true,pObj.aTagAttr.aChild.tn,true);}
s+='</div>';}
else{if(c.bMSKU_Enh){if(pAction==0){s+='<div id="'+oSC.sTagNameLyrPrefix+idx+'"'+sMargin+'>';s+=t.getTagTitle(idx,pName,null,true);}else{s+='<div id="'+oSC.sTagNameLyrPrefix+idx+'"'+sMargin_hide+'>';s+=t.getTagTitle(idx,pName,null,true);}
s+='</div></div>';}else{s+=t.getTagTitle(idx,pName);}}}
if(pObj.bDate)
s+='</div><div><table><tr><td width="135px" class="fl">';s+=bClosed?c.sClosedTopTagHTML.replaceTokens(pNoDDown?'<div class="clr"></div>':sSelectHTML,c.sHiddenParamPrefix+idx):(!(c.isVariation)&&c.isValRecom)?sTopHtml.replaceTokens(pAddBtnId?c.sMVTagTextBoxPrefix+idx:(pObj.bDate?'year_'+c.sTagTextBoxPrefix+idx:c.sTagTextBoxPrefix+idx),oSC.sDownArrowPrefix+idx,oSC.sTagValOptLyrPrefix+idx,c.sHiddenParamPrefix+idx,pAddBtnId?t.getAddTagBtn(t.sMVContainer+idx+"_add",bClosed):"",pAddBtnId?"PaddingTop":"DropDownPadding",(pObj.aTagAttr&&!pObj.oContainer&&!pObj.bMultiVal)?pObj.aTagAttr.hlpTxt:((!pObj.bMV&&!pObj.aTagAttr)?pObj.hlpTxt:""),(pObj.bDate||pObj.bYear)?4:50,(pObj.bDate||pObj.bYear)?12:49):sTopHtml.replaceTokens(pAddBtnId?c.sMVTagTextBoxPrefix+idx:(pObj.bDate?'year_'+c.sTagTextBoxPrefix+idx:c.sTagTextBoxPrefix+idx),oSC.sDownArrowPrefix+idx,oSC.sTagValOptLyrPrefix+idx,c.sHiddenParamPrefix+idx,pAddBtnId?t.getAddTagBtn(t.sMVContainer+idx+"_add",bClosed):"",pAddBtnId?"PaddingTop":"DropDownPadding",(pObj.bDate||pObj.bYear)?4:50,(pObj.bDate||pObj.bYear)?12:49);if(pObj.bDate){s+=c.sGhostHtml.replaceTokens(pObj.yearTxt);if(pObj.bFull||pObj.bPartial){s+='</td><td class="fl" style="vertcal-align:top"><div  >'+c.sTopMon_DayHTML.replaceTokens(pObj.bMV?'mon_'+c.sMVTagTextBoxPrefix+idx:'mon_'+c.sTagTextBoxPrefix+idx);+'</div></td>';if(pObj.bFull){s+='<td style=\"padding-left:6px;\" valign="top" class="fl"><div >'+c.sTopMon_DayHTML.replaceTokens(pObj.bMV?'day_'+c.sMVTagTextBoxPrefix+idx:'day_'+c.sTagTextBoxPrefix+idx)+'</div></td>';}
s+='</tr></table></div>';}}
if(!c.bMSKU_Enh&&!(pObj&&pObj.aTagAttr.bParent))
s+='</div>';}else{var sMargin=pAddBtnId?'':pObj&&pObj.oParentTag?' style="margin-top:5px;position:relative;"':' style="margin-top:7px"';var sMargin_hide=pAddBtnId?'':pObj&&pObj.oParentTag?' style="margin-top:5px;position:relative;"':' style="margin-top:7px; display:none;"';if(!c.bMSKU_Enh&&!pCustomTag)
s+='<div id="'+oSC.sTagNameLyrPrefix+idx+'"'+sMargin+'>';var msku=ebay.oP.controls['seller_tags'];if(pName){if(pCustomTag){if(pAction==0){s+='<div id="'+oSC.sTagNameLyrPrefix+idx+'"'+sMargin+'>';s+=t.getTagTitle(idx,pName,true,true);}else{s+='<div id="'+oSC.sTagNameLyrPrefix+idx+'"'+sMargin_hide+'>';s+=t.getTagTitle(idx,pName,true,true);}
s+='</div>';}else{if(c.bMSKU_Enh){if(pAction==0){s+='<div id="'+oSC.sTagNameLyrPrefix+idx+'"'+sMargin+'>';if(pSuggTagCtrl&&pSuggTagCtrl.bParent){s+=t.getTagTitle(idx,pName,null,true,pSuggTagCtrl.aChild.tn,true);}else{s+=t.getTagTitle(idx,pName,null,true);}}else{s+='<div id="'+oSC.sTagNameLyrPrefix+idx+'"'+sMargin_hide+'>';if(pSuggTagCtrl&&pSuggTagCtrl.bParent){s+=t.getTagTitle(idx,pName,null,true,pSuggTagCtrl.aChild.tn,true);}else{s+=t.getTagTitle(idx,pName,null,true);}}
s+='</div></div>';}else{s+=t.getTagTitle(idx,pName);}}}
s+=bClosed?c.sClosedTopTagHTML.replaceTokens(pNoDDown?'<div class="clr"></div>':sSelectHTML,c.sHiddenParamPrefix+idx):(!(c.isVariation)&&c.isValRecom)?sTopHtml.replaceTokens(pAddBtnId?c.sMVTagTextBoxPrefix+idx:c.sTagTextBoxPrefix+idx,oSC.sDownArrowPrefix+idx,oSC.sTagValOptLyrPrefix+idx,c.sHiddenParamPrefix+idx,pAddBtnId?t.getAddTagBtn(t.sMVContainer+idx+"_add",bClosed):"",pAddBtnId?"PaddingTop":"DropDownPadding",(pObj.aTagAttr&&!pObj.oContainer&&!pObj.bMultiVal)?pObj.aTagAttr.hlpTxt:((!pObj.bMV&&!pObj.aTagAttr)?pObj.hlpTxt:"")):c.bMSKU_Enh?(pSuggTagCtrl?sTopHtml.replaceTokens(pAddBtnId?c.sMVTagTextBoxPrefix+idx:c.sTagTextBoxPrefix+pIndex1,oSC.sDownArrowPrefix+pIndex1,oSC.sTagValOptLyrPrefix+pIndex1,c.sHiddenParamPrefix+pIndex1,pAddBtnId?t.getAddTagBtn(t.sMVContainer+idx+"_add",bClosed):"",pAddBtnId?"PaddingTop":"DropDownPadding",'',50,msku.isMSKUFlow?21:49,"Remove_"+idx,c.sTagTextBoxPrefix+idx,oSC.sDownArrowPrefix+idx,oSC.sTagValOptLyrPrefix+idx,c.sHiddenParamPrefix+idx):sTopHtml.replaceTokens(pAddBtnId?c.sMVTagTextBoxPrefix+idx:c.sTagTextBoxPrefix+idx,oSC.sDownArrowPrefix+idx,oSC.sTagValOptLyrPrefix+idx,c.sHiddenParamPrefix+idx,pAddBtnId?t.getAddTagBtn(t.sMVContainer+idx+"_add",bClosed):"",pAddBtnId?"PaddingTop":"DropDownPadding",'',50,msku.isMSKUFlow?21:49,"Remove_"+idx)):(sTopHtml.replaceTokens(pAddBtnId?c.sMVTagTextBoxPrefix+idx:c.sTagTextBoxPrefix+idx,oSC.sDownArrowPrefix+idx,oSC.sTagValOptLyrPrefix+idx,c.sHiddenParamPrefix+idx,pAddBtnId?t.getAddTagBtn(t.sMVContainer+idx+"_add",bClosed):"",pAddBtnId?"PaddingTop":"DropDownPadding",'',50,msku.isMSKUFlow?21:49));if(!c.bMSKU_Enh&&!pCustomTag)
s+='</div>';}
return s;}
this.getMVHiddenVal=function(pObj)
{var t=this,s="",p=t.parent,aV=pObj.aTagVals,c=p.oConfig,len=aV.length;for(var i=0;i<len;i++)
{if(aV[i].Sel)
{s+=aV[i].Val+c.sDelim+t.getSelValsrc(pObj,aV[i].Val)+c.sDelim;}}
pObj.oMVHiddenInp.setValue(s);}
this.getCustomTagHTML=function(pIndex)
{var t=this,c=t.parent.oConfig,idx=pIndex,sCustomHTML='',sCustomHTML1='';if(c.bMSKU_Enh&&c.aAddVarDivs){sCustomHTML1=c.sCustomHTML.replaceTokens(oSC.sCustomNamePrefix+idx,oSC.sCusSugNamePrefix+idx,c.sTagTextBoxPrefix+idx,oSC.sCustomRemovePrefix+idx,oSC.sCusSugValPrefix+idx,oSC.sCustomWarnPrefix+idx,c.sHiddenParamPrefix+idx);sCustomHTML+=c.sCustomHTML1;for(var x=0;x<c.aAddVarLen;x++){if(c.aAddVarDivs["chk"+x][1].bAdded!="true"){sCustomHTML+='<div><input type="checkbox" id="chk'+x+'" name="chk'+x+'" value=""><#123#></input></div>';sCustomHTML=sCustomHTML.replace("<#123#>",c.aAddVarDivs["chk"+x][0].tn);}}
sCustomHTML=sCustomHTML+sCustomHTML1;return sCustomHTML;}else{return c.sCustomHTML.replaceTokens(oSC.sCustomNamePrefix+idx,oSC.sCusSugNamePrefix+idx,c.sTagTextBoxPrefix+idx,oSC.sCustomRemovePrefix+idx,oSC.sCusSugValPrefix+idx,oSC.sCustomWarnPrefix+idx,c.sHiddenParamPrefix+idx);}}
this.getMultiValueCB=function(pVal,pCBName,pFloat)
{var t=this,oD=t.oDocument,oSpan=oD.createElement('span'),v=pVal.Val,sFloat=pFloat?"float:left":"";oSpan.setAttribute((!t.oGlobals.oClient.bIE)?'class':'className','MultiValueSpanWidth');oCBcontent='<div class="Float_Left"><div class="MultiValueCheckbox" ><input type="checkbox" title="'+unescape(v)+'" name="'+pCBName+'" id="'+pCBName+'" value="'+unescape(v)+'"';oCBcontent+=(pVal.Sel?" checked":"")+' /></div><div class="MultiValueContent">'+t.stripHTML(v)+'</div></div>';oSpan.innerHTML=oCBcontent;return oSpan;}
this.stripHTML=function(psString)
{return psString.replace(/</g,'&lt;').replace(/>/g,'&gt;');}
this.getAddTagBtn=function(pId,pbClosed)
{var sDisabled=pbClosed?"":"disabled",c=this.parent.oConfig;return'<input type="button" name="'+pId+'" id="'+pId+'" value ="'+c.sAddText+'" '+sDisabled+' />';}
this.getMultiValueHTML=function(pVals,pName,pIndex,pObj)
{var t=this,oD=t.oDocument,aV=pVals,len=aV.length,idx=pIndex,oContainer=oD.createElement('div'),oContainerParent=oD.createElement('div'),oDiv,iRow=0,cid=t.sMVContainer+idx,c=t.parent.oConfig,bRemoveDDown=false,ohlpTxtParent,oHlpTxtChild;bRemoveDDown=(pObj.objType=="EbaySYI3MultiValueControl")?((pObj.aValues.length<=1)&&pObj.bIsClosed):((pObj.objType=="EbaySYI3SugTagControl")?((pObj.aOptions.length<=0)&&pObj.bIsClosed):(pObj.Vals.length==0)&&pObj.bClosed);oContainer.id=cid;oContainerParent.appendChild(oContainer);var s='';s+='<div id="'+oSC.sTagNameLyrPrefix+pIndex+'" style="margin-top:10px;">';s+='<input type="hidden" id="'+c.sTagTextBoxPrefix+idx+'" name="'+c.sMVHiddenPrefix+idx+'" value="" />';s+=t.getTagTitle(pIndex,pName);for(var i=0;i<len;i++)
{if(i%3==0)
{oDiv=oD.createElement('div');oDiv.id=cid+iRow;oContainer.appendChild(oDiv);iRow++;}
oDiv.setAttribute((!t.oGlobals.oClient.bIE)?'class':'className','MultiValueDivWidth');oDiv.appendChild(t.getMultiValueCB(aV[i],cid+'_cb',(i%3==0)));}
if(c.isValRecom&&!(c.isVariation))
{ohlpTxtParent=oD.createElement('div');oHlpTxtChild=oD.createElement('div');oHlpTxtChild.setAttribute((!t.oGlobals.oClient.bIE)?'class':'className','help');oHlpTxtChild.innerHTML=(pObj.aTagAttr)?pObj.aTagAttr.hlpTxt:pObj.hlpTxt;ohlpTxtParent.appendChild(oHlpTxtChild)
s+=ohlpTxtParent.innerHTML;}
s+=oContainerParent.innerHTML;s+=t.getTopTagHTML(pIndex,null,true,null,pObj,bRemoveDDown)
s+='</div>';return s;}
this.addTopTagsCount=function(pAdd)
{var t=this;with(t.parent)
{if(oConfig.bMSKU_Enh&&iTotalTopTags>=6)
iTotalTopTags=5;if(pAdd)
iTotalTopTags++;else
iTotalTopTags--;if(!oSugSecLayer.eElem)
bindObj(oSugSecLayer);var b=iTotalTopTags>=oConfig.iMaxTag;oSugSecLayer.show(!b);if(b)
oTrayLayer.show(b);if(!oCustomLnk.eElem)
bindObj(oCustomLnk);oCustomLnk.show(!b);if(oCustomLnk.eElem)
oMsgLyr.show(b);else if(b&&oDividerLayer)
oDividerLayer.show(false);}}
this.fetchMatches=function(pSearch,pArray)
{var aMatch=[],a=pArray,str=pSearch.toLowerCase(),l=str.length;if(str=="")
return a;for(var i=0,len=a.length;i<len;i++)
{var s=a[i].length>l?a[i].substr(0,l).toLowerCase():a[i].toLowerCase();if(s==str)
aMatch.push(a[i]);}
return aMatch;}
this.createGradList=function(pTag,pValues)
{var t=this,p=t.parent,c=p.oConfig,aValues=pValues,oSugLyr=pTag.oSuggestLayer,oText=pTag.oTagText;with(t)
{aLayerValues=aValues;p.bindObj(oSugLyr);p.bindObj(oText);oSugLyr.setValue("");if(c.sMaxKeyStrokeLimit==2)
var l=aValues.length;else
var l=aValues.length>c.iMaxTagOptions?c.iMaxTagOptions:aValues.length;for(var i=0;i<l;i++)
createSuggestion(oSugLyr,pTag.sOPTIONS+i,aValues[i],i);showSuggestions();pTag.bSuggestionCreated=false;p.bLyrStatus=false;}}
this.createSuggestion=function(pSuggest,pLyrId,pValue,pIndex)
{var t=this;with(t)
{var oTag=pSuggest.parent,c=oTag.parent.oConfig,sActClass=oSC.sActiveClass,sPassClass=oSC.sPassiveClass;if(typeof(pValue)!='undefined'){var val=pValue.replace(new RegExp("\&","g"),"&amp;");appendChild(pSuggest.name,val,pLyrId,'div');var oL=new EbayHTMLLayer(pSuggest,pLyrId);oL.iIndex=pIndex;oL.subscribeEvents("onclick","onmouseover","onmouseout");oL.onmouseout=function()
{var t=this;t.setClass(sPassClass);}
oL.onmouseover=function()
{var t=this;with(t)
{var p=parent.parent.parent,u=p.oUtils,oCT=p.oCurrentTag;u.resetClass();setClass(oSC.sActiveClass);oCT.sSelOptionVal=getValue(true);oCT.iSelOption=iIndex;}}
oL.onclick=function()
{var t=this,p=t.parent.parent.parent,u=p.oUtils,oCT=p.oCurrentTag;with(oCT)
{oTagText.setValue(sSelOptionVal);oCT.sSelVal=sSelOptionVal;bIsEdited=sSelVal!=sSelOptionVal;u.hideSuggestions();if(typeof(c.bIsSwift)!='undefined'){var tn=aTagAttr.tn;if((tn=='Year'||tn=='Trim'||tn=='Engine')&&sSelOptionVal!=c.aTexts.ownname)
p.parent.controls["st_ymmte"].requestData(sSelOptionVal,oTagText);}
if(oCT.checkAutoComplete)
{checkAutoComplete();}
oTagText.focus(true);if(c.bMSKU_Enh&&c.aParChildMap){var i,j,aMap=c.aParChildMap,l=aMap.length,pp=t.parent.parent;for(i=0;i<l;i++){if(aMap[i].pn==tn){var innerMap=aMap[i].Vals,len=innerMap.length;for(j=0;j<len;j++){var chldCtrl=aTagAttr.aChild.tn+aTagAttr.idx+"_"+this.parent.name.split("_")[2];if(oTagText.getValue()=="-"){p.controls[chldCtrl].aValues=innerMap[0].val;if(!pp.contains(p.controls[chldCtrl].aValues,'<hr style="margin:0px 5px 0px 0px;" />'))
p.controls[chldCtrl].aValues.push('<hr style="margin:0px 5px 0px 0px;" />');if(!pp.contains(p.controls[chldCtrl].aValues,c.aTexts.ownname))
p.controls[chldCtrl].aValues.push(c.aTexts.ownname);break;}
else if(oTagText.getValue()==innerMap[j].opn){p.controls[chldCtrl].aValues=innerMap[j].val;if(!pp.contains(p.controls[chldCtrl].aValues,'<hr style="margin:0px 5px 0px 0px;" />'))
p.controls[chldCtrl].aValues.push('<hr style="margin:0px 5px 0px 0px;" />');if(!pp.contains(p.controls[chldCtrl].aValues,c.aTexts.ownname))
p.controls[chldCtrl].aValues.push(c.aTexts.ownname);break;}}
break;}}}}}
oL.bind();if(pValue==c.aTexts.ownname||pValue==c.aTexts.addMore)
{oL.setStyle('color','#666');}
oL.setClass(sPassClass);}}}
this.setIFShim=function(pElem)
{var t=this;if(!pElem.eElem)
return;var e=pElem,w=e.width(),h=e.height(),f=document.createElement('IFRAME');f.setAttribute('scrolling','no');with(f.style)
{position='absolute';top=0+'px';left=0+'px';zIndex='-1';width=w-20+'px';height=h-5+'px';}
f.frameBorder='0';f.src=t.oGlobals.oEnvironment.sPicsDir+'s.gif';e.eElem.appendChild(f);}
this.setTopPosition=function(pObj,pEvent)
{var t=this;with(t)
{var iEventY=null,iLocY=null,e=oDocument.getUIElem(pObj.oTagText.name),oPos=oUtils.oPositioning,ih=pObj.oSuggestLayer.height(),oD=oDocument,winHeight=oD.doc.body.clientHeight,cL=oGlobals.oClient,iLocY=oPos.getOffsetLeftTop(e)[1],evt=oDocument.win.event||pEvent;if(evt)
iEventY=evt.clientY;if(!cL.bIE)
winHeight=oD.win.innerHeight;else if(typeof(winHeight)=='undefined'&&cL.iVer>=6)
winHeight=oD.doc.documentElement.clientHeight;var iBtm=winHeight-iEventY;pObj.oSuggestLayer.top((iBtm>ih?iLocY+pObj.oTagText.height():iLocY-ih)+'px');}}
this.showSuggestions=function(pEvent)
{var t=this;with(t)
{var oCT=parent.oCurrentTag,oL;if(oCT&&oCT.name!=sCurTagName)
hideSuggestions();oL=oCT.oSuggestLayer.controls[oCT.sOPTIONS+'0'];if(!oL)
return;sCurTagName=oCT.name;if(oCT.oSuggestLayer.eElem){var cls=oCT.oSuggestLayer.eElem.className;if(!(cls=="En_tagSm"||cls=="En_tagL")){oCT.oSuggestLayer.setClass(parent.oConfig.sTagClass);}}
if(oL)
oL.setClass(oSC.sActiveClass);if(parent.oConfig.sMaxKeyStrokeLimit==2&&aLayerValues.length>25){oCT.oSuggestLayer.eElem.style.height='410px';oCT.oSuggestLayer.eElem.style.overflowY='auto';oCT.oSuggestLayer.eElem.style.overflowX='hidden';}
else
oCT.oSuggestLayer.eElem.style.height='';oCT.oSuggestLayer.show(true);setIFShim(oCT.oSuggestLayer);oCT.iSelOption=0;oCT.sSelOptionVal=oL.getValue(true);document.onkeydown=onKeyDown;document.onclick=onClickDoc;}}
this.hideSuggestions=function()
{var t=this;if(t.sCurTagName=="")
return;t.resetClass();if(t.parent.controls[t.sCurTagName].oSuggestLayer)
t.parent.controls[t.sCurTagName].oSuggestLayer.show(false);ebay.oDocument.oPage.bItemFocus=true;document.onkeydown=null;document.onclick=null;if(ebay.oP.bSugPPCreated)
document.onclick=onClkDoc;}
this.resetClass=function()
{var t=this;with(t.parent.oCurrentTag)
{if(oSuggestLayer.controls[sOPTIONS+iSelOption])
oSuggestLayer.controls[sOPTIONS+iSelOption].setClass(oSC.sPassiveClass);}}
this.onKeyDown=function(pEvent)
{var evt=pEvent||event,oCtrl=ebay.oDocument.oPage.controls['seller_tags'],oCT=oCtrl.oCurrentTag,u=oCtrl.oUtils;switch(evt.keyCode)
{case 38:case 40:u.NextSug(evt.keyCode);return false;break;case 13:with(oCT)
{if(oCT&&name)
{sSelOptionVal=bMultiVal?"":sSelOptionVal;oTagText.setValue(sSelOptionVal);sCurTextVal=sSelOptionVal;oCT.sSelVal=sSelOptionVal;bIsEdited=sSelVal!=sSelOptionVal;if(oCT&&!oCtrl.bLyrStatus)
u.hideSuggestions();oCtrl.bLyrStatus=false;oTagText.focus(true);if(oCT.checkAutoComplete)
checkAutoComplete();}}
return false;break;}}
this.NextSug=function(pKeyCode)
{var t=this;with(t)
{var p=t.parent,oCT=p.oCurrentTag,iSO=oCT.iSelOption,aV=aLayerValues,c=p.oConfig;resetClass();var l=aV.length>c.iMaxTagOptions?c.iMaxTagOptions:aV.length;iSO=pKeyCode==40?iSO+1:iSO-1;iSO=l==iSO?0:iSO<0?l-1:iSO;oCT.iSelOption=iSO;var oL=oCT.oSuggestLayer.controls[oCT.sOPTIONS+iSO];if(oL)
{if(oCT.oDownArrow&&oCT.oDownArrow.eElem){oCT.oDownArrow.eElem.setAttribute('aria-activedescendant',oL.eElem.id);}
oL.setClass(oSC.sActiveClass);oCT.sSelOptionVal=oL.getValue(true);}}}
this.onClickDoc=function()
{var oCtrl=ebay.oDocument.oPage.controls["seller_tags"];if(oCtrl.oCurrentTag&&!oCtrl.bLyrStatus)
oCtrl.oUtils.hideSuggestions();oCtrl.bLyrStatus=false;}
this.getRecoValues=function(pObj)
{var t=this,aV=pObj.aTagVals,dl=t.parent.oConfig.sDelim,s="",len=aV.length;for(var i=0;i<len;i++)
{if(aV[i].Sel)
{var len2=pObj.aValues.length;for(var k=0;k<len2;k++)
{if(aV[i].Val==pObj.aValues[k])
{s=s+pObj.aValues[k]+dl;}}
len2=pObj.aAutoCompleteValues.length;for(var j=0;j<len2;j++)
{if(aV[i].Val==pObj.aAutoCompleteValues[j])
{s=s+pObj.aAutoCompleteValues[j]+dl;}}}}
return s;}
this.setHiddenValues=function(pObj,pTname,pSrc,pAction,pSelVal,pValSrc)
{var t=this,p=pObj,ht=p.oHiddenText,dl=t.parent.oConfig.sDelim,s="";with(t)
{if(pObj.bMultiVal&&pObj.aTagVals)
{var tname=replaceString(pObj.name),tsrc=replaceString(pSrc?pSrc:pObj.iTsrc),taction=replaceString(pAction?pAction:pObj.iTaction);var trecoval=replaceString(t.getRecoValues(pObj));s=tname+dl+tsrc+dl+taction+dl+trecoval;}
else
{var tname=replaceString(pTname),tsrc=replaceString(pSrc),taction=replaceString(pAction),trecoval=replaceString(pSelVal),selvalsrc=replaceString(pValSrc);s=tname+dl+tsrc+dl+taction+dl+trecoval+dl+selvalsrc;}
p.parent.bindObj(ht);s=unescapeHTMLCode(s);ht.setValue(s);}}
this.setHiddenIndex=function(pIndex)
{var t=this;with(t.parent)
{bindObj(oHiddenIndex);oHiddenIndex.setValue(pIndex);}}
this.replaceString=function(pStr)
{return pStr!=""?pStr:"\"\"";}
this.getSelValsrc=function(pObj,pVal)
{var t=this,p=pObj.parent,oU=t.oUtils;with(pObj)
return oU.isInArray(aAutoCompleteValues,pVal)?p.aSelValSrc.manualAuto:oU.isInArray(aValues,pVal)?p.aSelValSrc.fromReco:p.aSelValSrc.manualNoAuto;}
this.setSelValsrc=function(pObj,pVal)
{var t=this,p=pObj.parent,oU=t.oUtils;with(pObj)
sValSrc=oU.isInArray(aAutoCompleteValues,pVal)?p.aSelValSrc.manualAuto:oU.isInArray(aValues,pVal)?p.aSelValSrc.fromReco:p.aSelValSrc.manualNoAuto;}
this.setTagOptions=function(pObj,pVals,pClosed,pIgnoreOwnValue,pDate,pYear,pChildVar)
{var t=this,p=t.parent,c=p.oConfig,len=pVals.length,bDup=false;with(pObj)
{aValues=[];for(var i=0;i<len;i++)
{if(pDate||pYear){if(!isNaN(pVals[i].Val)){var v=pVals[i].Val.substring(0,4);for(var j=0;j<aValues.length;j++){if(aValues[j]==v){bDup=true;break;}}
if(!bDup)
aValues[aValues.length]=(typeof(v)!='undefined')?v:pVals[i].Val;else
bDup=false;}}
else{if(pVals[i]){var v=pVals[i].Val;aValues[i]=v;}}
if(pVals[i]&&pVals[i].Sel)
{sSelVal=v;sValSrc=p.aSelValSrc.fromReco;bIsPrePopulated=true;var ln=pVals[i].Val.length;if(pDate&&ln>4){if(!isNaN(pVals[i].Val)){sSelMonInd=(pVals[i].Val.substring(4,6)-1);if(ln>6)
sSelDayInd=pVals[i].Val.substring(6,8);}}}
if(!oTagText.eElem)
p.bindObj(oTagText);if(bIsPrePopulated)
oTagText.setValue(sSelVal);}
if(pClosed)
{for(var i=0;i<len;i++)
{if(pDate||pYear){if(!isNaN(pVals[i].Val)){var v=pVals[i].Val.substring(0,4);for(var j=0;j<aValues.length;j++){if(aValues[j]==v){bDup=true;break;}}
if(!bDup)
aValues[i]=(typeof(v)!='undefined')?v:pVals[i].Val;else
bDup=false;}}
else{var v=pVals[i].Val;aValues[i]=v;}}
aValues.unshift("-");}
else if(!pIgnoreOwnValue)
{aValues.push('<hr style="margin:0px 5px 0px 0px;" />');aValues.push(pObj.bMultiVal?c.aTexts.addMore:c.aTexts.ownname);}
if(pClosed){for(var i=0;i<len;i++){if((pDate||pYear)&&!isNaN(pVals[i].Val)){if(!oTagText.eElem)
p.bindObj(oTagText);oTagText.clearOptions();for(var op=0;op<aValues.length;op++)
oTagText.createOption(aValues[op],aValues[op]);if(pVals[i].Sel)
{sSelVal=pVals[i].Val;sValSrc=p.aSelValSrc.fromReco;bIsPrePopulated=true;var ln=pVals[i].Val.length;if(pDate&&ln>4){if(!isNaN(pVals[i].Val)){sSelMonInd=(pVals[i].Val.substring(4,6)-1);if(ln>6)
sSelDayInd=pVals[i].Val.substring(6,8);}}}
if(sSelVal!="")
oTagText.selectByValue(pVals[i].Val.substring(0,4));}}}}}
this.getSpellUOMChecks=function(pData)
{var aData=pData;if(aData["SugVal"])
{var oCtrl=ebay.oDocument.oPage.controls['seller_tags'];with(oCtrl)
{var s=aData["SugType"]==1?oConfig.aTexts.spellCheck:oConfig.aTexts.UOM;oSpellUOM.setValue(s.replaceTokens(SpellUOMCheckId,aData["SugVal"]));aSpellUOMResponse=pData;oSpellUOM.show(true);oSpellUOM.setClass(oConfig.spellcheck);sSpellSugValue=aData["SugVal"];if(SpellUOMCheckId.has('Name')){oCtrl.oValLink=new EbayHTMLLayer(oSpellUOMParent,SpellUOMCheckId);oCtrl.oValLink.subscribeEvents("onclick");oCtrl.oValLink._registerEvent('onclick','parent.parent.parent.oUtils.onLinkClick');bindObj(oCtrl.oValLink);oCtrl.oValLink.oSpellUOM=oSpellUOM;}else{oCtrl.oSugLink=oL=new EbayHTMLLayer(oSpellUOMParent,SpellUOMCheckId);oCtrl.oSugLink.subscribeEvents("onclick");oCtrl.oSugLink._registerEvent('onclick','parent.parent.parent.oUtils.onLinkClick');bindObj(oCtrl.oSugLink);oCtrl.oSugLink.oSpellUOM=oSpellUOM;}
oSpellUOM.setClass(oSC.sPassiveClass);}}}
this.onLinkClick=function()
{var t=this,val=t.getValue(true);t.oSpellUOM.show(false);t.oSpellUOM.setValue('');with(t.parent)
{setValue(val);var a=t.parent.name;if(a.has('Name'))
parent.sSugName=val;else
parent.sSugValue=val;focus(true);}}
this.trim=function(pStr)
{var str=new String(pStr);str=str.replace(/^\s*/,"");str=str.replace(/\s*$/,"");return str;}
this.createChildTags=function(oTag,pChildIndex)
{var att=oTag.aTagAttr,p=oTag.parent,c=p.oConfig,tagSuffix=oTag.sSuffix;for(var i=(att.aChildren.length-1);i>=0;i--)
{var aC=att.aChildren[i],tagSuffix=tagSuffix+1,u=oTag.parent.oUtils,tn=aC.tn,sTagName=tn.replace(/\s/g,"");sHtml=aC.bMV?u.getMultiValueHTML(p.oTagControls[sTagName].aTagVals,aC.tn,tagSuffix,p.oTagControls[sTagName]):u.getTopTagHTML(tagSuffix,aC.tn,false,null,p.oTagControls[sTagName]),oRefNode=oTag?oTag.oTagOuterLayer:null;if(oRefNode&&!oRefNode.eElem)
oRefNode.bind();sOuterPrefix=tagSuffix;u.appendChild(c.sTopSectionLyr,sHtml,oSC.sTagOuterLyrPrefix+sOuterPrefix,'div',oRefNode?oRefNode.eElem:null);var oCTag=p.oTagControls[sTagName],sTraySrc=(oCTag.sAction==p.aTaction.removed)?p.aTsrc.recoTop:p.aTsrc.trayUsed;oCTag=p.oTagControls[sTagName]=oTag.oChild=oCTag.aTagAttr.aChildren?new EbaySYI3DepTagControl(p,oTag,tn,tagSuffix,sTraySrc,true,aTagVals,false,c,null,pChildIndex):oCTag.bMultiVal?new EbaySYI3MultiValueControl(p,tn,tagSuffix,sTraySrc,true,oCTag.aTagAttr,oCTag.aTagVals,c,oTag,pChildIndex):new EbaySYI3TagControl(p,oTag,tn,tagSuffix,sTraySrc,true,oCTag.aTagAttr,false,c,null,pChildIndex);if(oTag.aChild)
{var len=oTag.aChild.length;for(var j=0;j<len;j++)
{if(oTag.aChild[j].sTagCtrlName==oCTag.sTagCtrlName)
oTag.aChild[j]=oCTag;}}
delete p.oSugTagControls[sTagName];oCTag.init(oCTag.aOptions,false,true);if(!oCTag.bNoDropDown)
{oCTag.oTagText.enable(false);oCTag.oTagText.setClass("disableCtrl");}
oCTag.oRemove.show(false);if(oCTag&&oCTag.aTagAttr.aChildren)
t.createChildTags(oCTag,pChildIndex+1);}}
this.createMSKUChildTags=function(pTag,pIndex)
{var att=pTag.aTagAttr,p=pTag.parent,c=p.oConfig,len=att.aChildren.length;for(var i=0;i<len;i++)
{var aC=att.aChildren[i],u=pTag.parent.oUtils,tn=aC.tn,sTagName=tn.replace(/\s/g,""),sTagName=sTagName.replace(new RegExp("'","g"),""),iIdx=pIndex+"_"+i,sTagName=sTagName+pIndex,sSugTName=oSC.sSugTagPrefix+iIdx,sDesLyr=oSC.sDesLyrId+iIdx,sHiddName=c.sTagSeqPrefix+iIdx;var sTopHTML=c.sVariationHTML.replaceTokens(sDesLyr,oSC.sVarLyr+iIdx,"");u.appendChild(oSC.sTagOuterLyrPrefix+pIndex,sTopHTML,c.sTopSectionLyr+pIndex,'div');}}
this.sortMulti=function(pA,pB)
{var aV=pA.Val.toLowerCase(),bV=pB.Val.toLowerCase();if(aV==bV)
return 0;return(aV<bV)?-1:1;}
this.postSOJTag=function()
{var p=this.parent;if(!p.bSOJTagged)
{var oSOJ=ebay.oP.controls['soj_tagging'];if(oSOJ)
oSOJ.registerTag({"k":"SellerTagsUsed"});p.bSOJTagged=true;}}
this.unescapeHTMLCode=function(str)
{str=str.replace(/&amp;/g,"&");str=str.replace(/&lt;/g,"<");str=str.replace(/&gt;/g,">");return str;}}

//51@@m31

function EbaySYI3OverlayTagControl(pParent,pCfg)
{if(!this.objType)
this.objType="EbaySYI3OverlayTagControl";var t=this,c=pCfg;c.bClearValueOnClose=true;t.base=EbayHTMLOverlayContent;t.base(pParent,c.sLayerHTMLName,c);t.oSuggestCtl=null;t.bIsShown=false;t.rVal="";t.oCustomControl=null;t.oOlayShadow=new EbayHTMLLayer(t,c.stOlayShadow);t.oOlayContent=new EbayHTMLLayer(t,c.stOlay);t.oOlayCloseBtn=new EbayHTMLLayer(this,c.closeBtnDiv);t.iCusLen=0;for(var i=0,len=c.aCancelLinks.length;i<len;i++)
{var oL=new EbayHTMLAnchor(t,c.aCancelLinks[i]);oL.subscribeEvents("onblur");oL._registerEvent('onclick','parent.closeOverlay');if(oL.name==c.aCancelLinks[1]){this.lastElem=oL;oL.subscribeEvents('onkeydown');oL.onkeydown=this.focusFirst;}
oL.bind();this.focusFirst=function(elem,e){if(this==this.parent.lastElem){var e=window.event||e;if(e&&e.keyCode==9&&!e.shiftKey){this.parent.firstElem.focus();}
else{return;}}
return false;}
this.retainFocusInside=function()
{if(this.parent.eElem!=null)
{if(this.parent.eElem.firstChild!=null&&this.parent.bIsShown)
this.parent.eElem.firstChild.focus(true);}
return false;}
this.closeOverlay=function()
{var t=this;var p=t.parent,pp=p.parent;if(p.oCustomControl!=null)
{delete pp.oCustomControls[p.oCustomControl.name];p.oCustomControl=null;}
t.parent.bIsShown=false;t.parent.close();var oCurrentEle=pp.controls[oSC.sCustomLyrId],oCurrentSugTag=p.oSuggestCtl.oSugTag;if(oCurrentSugTag)
{if(oCurrentSugTag.eElem)
oCurrentEle=oCurrentSugTag.eElem.firstChild;}
if(oCurrentEle)
oCurrentEle.focus(true);}}
this.focusLast=function(e){var e=window.event||e;if(e&&e.keyCode==9&&e.shiftKey){ebay.oDocument.doc.getElementById("closeBtn").focus();}
else{return;}
return false;}
this.resizeOverlay=function(pObj)
{var t=this,iContentHeight=t.oOlayContent.height(),iContentWidth=t.oOlayContent.width();if(iContentHeight>0)
{t.oOlayShadow.bind();t.oOlayShadow.height(iContentHeight+'px');t.oOlayShadow.width(t.oOlayContent.width()+'px');var oCL=t.oGlobals.oClient,bIE6=oCL.bIE&&oCL.iVer<7;if(oCL.bIE)
{var oIF=t.eElem.getElementsByTagName('iframe');if(oIF)
{var ifElem=oIF[0];ifElem.style.top='0px';ifElem.style.width=(iContentWidth-5)+'px';if(bIE6)
ifElem.style.height=iContentHeight+'px';}}}}
t.oSaveButton=new EbayHTMLAnchor(t,c.sSave);this.oSaveButton.subscribeEvents("onkeydown");this.oSaveButton._registerEvent('onclick','parent.chkEventSaveBtn');if(c.bIsDYI)
this.oSaveButton._registerEvent('onkeydown','parent.chkEventSaveBtn');this.oSaveButton.bind();this.chkEventSaveBtn=function(e)
{var key=window.event?window.event.keyCode:arguments[2]?arguments[2].keyCode:0;if((e.name=='onkeydown')&&(key==13)||(e.name=='onclick'))
this.parent.saveOverlay(this);if(c.bIsDYI)
ebay.oP.sherpaItemSpec();}
this.saveOverlay=function(t)
{t=t.name=='onclick'?this:t;var p=t.parent,pp=p.parent;oSuggestControl=p.oSuggestCtl;var oL=p.controls[p.sContentDiv],v=oL?oL.getValue():p.sContent;var lenCfg=this.parent.oConfig;if(lenCfg){var len=lenCfg.aAddVarLen;if(len){if(ebay.oDocument.oPage.changeLen==null||ebay.oDocument.oPage.changeLen==undefined)
ebay.oDocument.oPage.changeLen=len;for(var x=0;x<len;x++){if(this.parent.oOverlayTag.oCustomControl!=null)
var isCheckBox=this.parent.oOverlayTag.oCustomControl.oCustomChkBox[x];if(isCheckBox&&isCheckBox.isChecked()){ebay.oDocument.oPage.changeLen--;}}}}
if(!oSuggestControl.name.is('seller_tags'))
{var oCurrTag=p.parent.oTagControls[oSuggestControl.sTagCtrlName];if(!oCurrTag.bNoDropDown)
oSuggestControl.sSelOptionVal=pp.oUtils.stripHTML(oCurrTag.oTagText.getValue());if(oSuggestControl.bDate&&(oSuggestControl.bFull||oSuggestControl.bPartial)){oSuggestControl.sSelMonInd=oCurrTag.oMon.getSelectedIndex();if(!oSuggestControl.bPartial)
oSuggestControl.sSelDayInd=oCurrTag.oDay.getSelectedIndex();}
if(oCurrTag.objType=="EbaySYI3DepTagControl")
{oCurrTag.bSaveClicked=true;oCurrTag.bIsClosed?oCurrTag.oTagText.onchange():oCurrTag.oTagText.onblur();}}
p.bIsShown=false;p.close();var oCurrentEle=pp.controls[oSC.sCustomLyrId],oCurrentSugTag=p.oSuggestCtl.oSugTag;if(oCurrentSugTag)
{if(oCurrentSugTag.eElem)
oCurrentEle=oCurrentSugTag.eElem.firstChild;}
if(oCurrentEle)
oCurrentEle.focus(true);if(typeof oSuggestControl!="undefined"&&oSuggestControl.oCustEditCtrl){var oCus=oSuggestControl.oCustEditCtrl;var len=Math.max.apply(Math,pp.oConfig.aCustTagLen);for(var x=0;x<len;x++){var oHdnFld=ebay.oDocument.getUIElem("vt_tmdata_"+oCus.oHdnFld[x]);if(oHdnFld)
oHdnFld.value=oHdnFld.value.replace(oCus.oCustTagCtrl.aTagAttr.tn,oCus.oCustTxt);}
var oRnFld=ebay.oDocument.getUIElem("vt_rename_"+oCus.oRnFld);if(p.rVal==""&&!p.contains(p.rVal,"!?^")&&oRnFld){p.rVal=oRnFld.value;}
if(oRnFld)
oRnFld.value=oCus.oCustTxt+"!?^"+p.rVal;oCus.oCustLabel.bind();oCus.oCustLabel.setValue(oCus.oCustTxt);oCus.oCustTagCtrl.name=oCus.oCustTagCtrl.name.replace(oCus.oCustTagCtrl.aTagAttr.tn,oCus.oCustTxt);oCus.oCustTagCtrl.aTagAttr.tn=oCus.oCustTxt;oCus.oCustTagCtrl.iTname=oCus.oCustTxt;if(oCus.oCustTagCtrl.aTagAttr.iAddLinkId)
var addV=oCus.oCustTagCtrl.aTagAttr.iAddLinkId;else
var addV=oCus.oCustTagCtrl.aTagAttr.iSortOrder;ebay.oDocument.getUIElem("AddVariation_"+addV).innerHTML='<a href="javascript:void(0);"><span><img src="http://pics.ebaystatic.com/aw/pics/buttons/btnOptionAdd.gif" alt=" " align="top" border="0" hspace="1">&nbsp;<b class="g-hdn">Add</b>&nbsp;'+oCus.oCustTxt+'</span></a><input value="'+oCus.oCustTagCtrl.oSugCtrl.oHiddenText.getValue()+'" name="'+oCus.oCustTagCtrl.oSugCtrl.oHiddenText.name+'" type="hidden">';}
var oCusTag=pp.oOverlayTag.oCustomControl;if(pp.isMSKUFlow&&oCusTag)
{if(pp.oConfig.bMSKU_Enh&&pp.oConfig.aAddVarDivs){var l=pp.oConfig.aAddVarLen;for(var x=0;x<l;x++){if(oCusTag.oCustomChkBox[x].isChecked()){pp.oConfig.aAddVarDivs["chk"+x][1].bAdded="true";oCusTag.oAddVarDiv[x].show(true);pp.controls[pp.oConfig.aAddVarDivs["chk"+x][0].tn+pp.oConfig.aAddVarDivs["chk"+x][3].iIdx].oSugTag.onclick();}else{if(pp.oConfig.aAddVarDivs["chk"+x][1].bAdded!="true")
oCusTag.oAddVarDiv[x].show();}}
if(!oCusTag.oAddOwnChkBox.isChecked())
return;}
var sTn=oCusTag.oNameTexBox.getValue(),sTv=oCusTag.oValueTexBox.getValue(),sTn=escapeHTMLCode(sTn),iIdx=oCusTag.iIndex,att={"Vals":[],"tn":sTn,"edit":1,"bMV":0,"bReq":0,"bClosed":0,"sHelpUrl":"","bIsTopTag":false,"iSortOrder":0},sTname=sTn.replace(/\s/g,""),tnCtrl=sTname+iIdx;if(pp.oConfig.bMSKU_Enh&&pp.oConfig.aAddVarDivs){att={"Vals":[],"tn":sTn,"edit":1,"bMV":0,"bReq":0,"bClosed":0,"sHelpUrl":"","bIsTopTag":false,"iSortOrder":0,"iAddLinkId":iIdx,"bCustomTag":1};p.iCusLen+=2;pp.oConfig.aCustTagLen.push(p.iCusLen);}
var oSug=pp.oSugTagControls[tnCtrl]=new EbaySYI3SuggestTagControl(pp,sTn+iIdx,iIdx,pp.aTaction.custom,false,att,pp.oConfig,true);oSug.iTsrc=oCusTag.iTsrc;oSug.oSugTag.onclick();var idx=oSug.iIndex+"_0";if(pp.oTagControls[sTn+idx]){pp.oTagControls[sTn+idx].oTagText.setValue(sTv);oHidnCusTag=oCusTag.oHiddenText.getValue();pp.oTagControls[sTn+idx].oHiddenText.setValue(oHidnCusTag);}
delete pp.oCustomControls[oCusTag.name];pp.oOverlayTag.oCustomControl=null;}
else
oSuggestControl.createTopTag(v);var oCurrentEle=pp.controls[oSC.sCustomLyrId];if(oCurrentEle)
setTimeout(function(){oCurrentEle.focus(true);},10);return false;}
this.contains=function(arr,findValue){var i=arr.length;while(i--){if(arr[i]===findValue)return true;}
return false;}
this.displayOverlay=function(pVal,pSugObj,pObj)
{var t=this;t.oSuggestCtl=pSugObj;t.oObj=pObj;t.sContent=pVal;t.setCoords();t.bIsShown=true;t.setPositionCloseBtn();var sFirstInsElem=this.eElem.firstChild;this.firstElem=sFirstInsElem;sFirstInsElem.onkeydown=this.focusLast;}
this.setCoords=function()
{var t=this;var offLoc=t.oUtils.oPositioning.getOffsetLeftTop(t.oObj.eElem);var browserLoc=[t.oGlobals.oClient.getBrowserWindowWidth()+t.oGlobals.oClient.getScrollLeft(),t.oGlobals.oClient.getBrowserWindowHeight()+t.oGlobals.oClient.getScrollTop()];var div1=document.createElement('div');div1.style.position="absolute";div1.style.width="300px";div1.style.height="300px";div1.style.top="0px";div1.style.left="0px";var div2=document.createElement('div');div2.style.position="absolute";div2.style.top="0px";div2.style.left="0px";div2.innerHTML=t.sContent;div1.appendChild(div2);document.body.appendChild(div1);var tH=div2.offsetHeight+50,tW=div2.offsetWidth+50;var bTop=((offLoc[1]+tH)>browserLoc[1]);var bLeft=(((offLoc[0]+tW+30)>browserLoc[0])&&(offLoc[0]>tW));t.sLeft=(bLeft?(offLoc[0]-tW+30):(offLoc[0]+30))+'px';t.sTop=(bTop?(offLoc[1]-tH):(offLoc[1]+20))+'px';document.body.removeChild(div1);t.display();var oOlay=t.oOlayContent;oOlay.bind();var aOlayDims=[oOlay.width(),oOlay.height()],offLoc=t.oUtils.oPositioning.getOffsetLeftTop(t.oObj.eElem);var browserLoc=[t.oGlobals.oClient.getBrowserWindowWidth()+t.oGlobals.oClient.getScrollLeft(),t.oGlobals.oClient.getBrowserWindowHeight()+t.oGlobals.oClient.getScrollTop()];var bTop=((offLoc[1]+aOlayDims[1])>browserLoc[1]);var bLeft=(((offLoc[0]+aOlayDims[0]+30)>browserLoc[0])&&(offLoc[0]>aOlayDims[0]));t.sLeft=(bLeft?(offLoc[0]-aOlayDims[0]+30):(offLoc[0]+30))+'px';t.sTop=(bTop?(offLoc[1]-aOlayDims[1]):(offLoc[1]+20))+'px';t.setPosition();var cp=t.oUtils.controlPath(t);setTimeout(cp+".resizeOverlay()",100);}
this.setPositionCloseBtn=function()
{with(this)
{if(!oOlayCloseBtn.eElem)
oOlayCloseBtn.bind();if(oOlayCloseBtn!=null)
oOlayCloseBtn.eElem.style.position='absolute';}}}

//52@@m6

function EbaySYI3MultiValueControl(pParent,pName,pIndex,pSource,pIsBind,pTagAttr,pTagVals,pCfg,pParentTag,pChildIndex)
{if(!this.objType)
this.objType="EbaySYI3MultiValueControl";this.base=EbaySYI3TagControl;this.aTagVals=pTagVals;this.base(pParent,pParentTag?pParentTag:null,pName,pIndex,pSource,pIsBind,pTagAttr,true,pCfg,pChildIndex);var t=this,pI=pIndex,iRow=0,u=t.parent.oUtils,mvContainer=u.sMVContainer;t.oContainer=new EbayHTMLLayer(t,mvContainer+pI);if(!t.bNoDropDown)
{t.oAddBtn=new EbayHTMLButton(t,mvContainer+pI+'_add');t.oAddBtn._registerEvent("onclick","parent.addClick");t.oTagText._registerEvent('onfocus','parent.validateTag');t.bIsClosed?t.oTagText._registerEvent('onchange','parent.validateTag'):t.oTagText._registerEvent('onkeyup','parent.validateTag');}
t.oMultiValCB=new EbayHTMLCheckbox(t,mvContainer+pI+'_cb');t.oMVHiddenInp=new EbayHTMLText(t,pCfg.sMVHiddenPrefix+pI);t.oMultiValCB._registerEvent('onclick','parent.onClickMVCB');this.validateTag=function()
{var t=this,bEnable=(t.getValue().length>0&&!t.getValue().is(t.parent.bIsClosed?"-":t.parent.parent.oConfig.aTexts.ownValue));if(bEnable)
{t.setStyle('color','');}
t.parent.oAddBtn.enable(bEnable);}
this.onClickMVCB=function()
{var t=this,bMultipleCB=t.eElem.length?true:false;var p=t.parent,v=bMultipleCB?unescape(t.getValueByIndex(arguments[arguments.length-1])):unescape(t.getValue(true)),b=bMultipleCB?t.isCheckedByValue(v):t.isChecked(),aV=p.aTagVals,len=aV.length;for(var i=0;i<len;i++)
{if(aV[i].Val.is(v))
{aV[i].Sel=b?1:0;break;}}
p.bIsEdited=true;p.parent.oUtils.getMVHiddenVal(p);p.parent.oUtils.setHiddenValues(p);}
t.initBase=t.init;this.init=function(pVals,pSetTagOptions,pInitBase)
{var t=this,p=t.parent;if(t.bIsBind)
{p.bindObj(t.oContainer);if(!t.bNoDropDown)
p.bindObj(t.oAddBtn);p.bindObj(t.oMultiValCB);p.bindObj(t.oMVHiddenInp);}
p.oUtils.getMVHiddenVal(t);p.oUtils.setHiddenValues(t);if(pInitBase)
t.initBase(pVals,false);t.checkValues();t.checkMaxTags();}
this.checkMaxTags=function()
{var t=this;if(t.bNoDropDown)
return;var iTagCount=t.aTagVals.length;if(iTagCount>=oSC.iMaxMVTags&&!t.aTagAttr.bClosed)
t.oTagText.enable(false);}
this.addClick=function()
{var t=this,p=t.parent,oD=t.oDocument,pp=p.parent,sSelVal=pp.oUtils.trim(p.oTagText.getValue()),iarrIdx=p.aTagVals.length,oContainer=p.oContainer,sContName=oContainer.name,oCurrDiv=p.oDocument.getUIElem(sContName+(Math.ceil(iarrIdx/2)-1)),aV=p.aTagVals,aSugVals=p.aValues,att=p.aTagAttr;if(sSelVal=='-'||sSelVal=='')
return;p.bIsEdited=true;var len=aV.length;for(var index=0;index<len;index++)
{if(aV[index].Val==sSelVal)
return;}
var aOption=aV[aV.length]={'Val':sSelVal,'Sel':1};oCurrDiv=oD.createElement('div');oCurrDiv.id=sContName+(Math.floor(iarrIdx/3));oContainer.eElem.appendChild(oCurrDiv);oCurrDiv.setAttribute((!t.oGlobals.oClient.bIE)?'class':'className','MultiValueDivWidth');oCurrDiv.appendChild(pp.oUtils.getMultiValueCB(aOption,sContName+'_cb',(iarrIdx%3==0)));p.bIsClosed?p.oTagText.deleteOption(p.oTagText.getSelectedIndex()):p.oTagText.setValue('');if(p.bIsClosed)
p.oTagText.selectByIndex(p.oTagText.getIndexByValue("-"));t.enable(p.bIsClosed?true:false);oD.clearControl(p.oMultiValCB.name);p.oMultiValCB.bind();for(var j=0,iLen=p.aTagAttr.Vals.length;j<iLen;j++)
{if(p.aTagAttr.Vals[j].Val.is(sSelVal))
{delete p.aTagAttr.Vals[j];p.aTagAttr.Vals.sort();p.aTagAttr.Vals.length-=1;break}}
for(var i=0,len=aSugVals.length;i<len;i++)
{if(aSugVals[i].is(sSelVal))
{delete aSugVals[i];if(!p.bIsClosed)
{var sMsg=aSugVals.pop(),sHr=aSugVals.pop();}
aSugVals.sort();aSugVals.length-=1;if(!p.bIsClosed)
{aSugVals.push(sHr);aSugVals.push(sMsg);}
p.createSuggestions();break;}}
len=p.aAutoCompleteValues.length;for(var n=0;n<len;n++)
{sAVal=p.aAutoCompleteValues[n];var len2=aV.length;for(i=0;i<len2;i++)
{if(aV[i].Val.is(sAVal))
{p.aAutoCompleteValues.splice(n,1);p.aAutoCompleteValues.sort();}}}
if(aSugVals.length==1&&p.bIsClosed)
{var oDropDiv=oD.getUIElem(p.oTagText.name).parentElement;oDropDiv.parentElement.removeChild(oDropDiv);oD.clearControl(p.oTagText.name);oD.clearControl(p.oAddBtn.name);p.bNoDropDown=true;}
t.parent.checkMaxTags();pp.oUtils.getMVHiddenVal(p);pp.oUtils.setHiddenValues(p);pp.oOverlayTag.resizeOverlay(t.parent);}
this.checkValues=function()
{var t=this,aV=t.aTagVals,len=aV.length,oCB=t.oMultiValCB;for(var i=0;i<len;i++)
oCB.setValue(aV[i].Val,aV[i].Sel==1);}
t.unbindObjectsBase=t.unbindObjects;this.unbindObjects=function()
{var t=this,oD=t.oDocument;oD.clearControl(t.oMultiValCB.name);if(!t.bNoDropDown)
oD.clearControl(t.oAddBtn.name);oD.clearControl(t.oContainer.name);oD.clearControl(t.oMVHiddenInp.name);t.unbindObjectsBase();}
t.init(pTagAttr,false,false);}

//53@@m13

function is_child_of(parent,child){if(child!=null){while(child.parentNode){if((child=child.parentNode)==parent){return true;}}}
return false;}
function titleGuidanceReq(element,event){if(ebay.oDocument.oPage.bItemFocus)
{var current_mouse_target=null,itemConVal="",tempVal="",bValAdd=false;if(event.toElement){current_mouse_target=event.toElement;}else if(event.relatedTarget){current_mouse_target=event.relatedTarget;}
if(!is_child_of(element,current_mouse_target)&&element!=current_mouse_target&&event.target.type!="select-one"){itemTleElem=ebay.oDocument.getUIElem("title");itemCon=ebay.oDocument.getUIElem("itemCondition");if(itemCon)
itemConVal=itemCon.value;if(itemTleElem)
itemTitle=encodeURIComponent(itemTleElem.value);var tagCtrl=ebay.oDocument.oPage.controls["seller_tags"];with(tagCtrl){oAjaxListner=processTitleGuidResponse;c=oConfig,iTags=0;sUrl=c.sReqUrl.replaceTokens('7',itemTitle,"","",itemConVal);for(var oTag in oTagControls){tempElem=oTagControls[oTag];if(tempElem.bMultiVal){var bMulValAdd=false;for(k=0;k<tempElem.aTagVals.length;k++){if(tempElem.aTagVals[k].Sel){tempVal+=c.sDelim+encodeURIComponent(tempElem.aTagVals[k].Val);bMulValAdd=true;}}
if(bMulValAdd){sUrl+='&selNV_'+iTags+++'='+encodeURIComponent(oTagControls[oTag].name)+tempVal;bMulValAdd=false;tempVal="";}}else{var tv="";if(tempElem.oTagText.eElem)
tv=tempElem.oTagText.eElem.value;if(tv){sUrl+='&selNV_'+iTags+++'='+encodeURIComponent(oTagControls[oTag].name)+c.sDelim+encodeURIComponent(tv);}}}
sUrl+='&maxNVSeq='+iTags;oUtils.requestData(sUrl);ebay.oDocument.oPage.bItemFocus=false;}}}}
function titleguidonchange(){ebay.oDocument.oPage.bItemFocus=true;}
function titleGuidancePageLoad(){var itemConVal="",tempVal="",bValAdd=false;itemTleElem=ebay.oDocument.getUIElem("title");itemCon=ebay.oDocument.getUIElem("itemCondition");if(itemCon)
itemConVal=itemCon.value;if(itemTleElem)
itemTitle=encodeURIComponent(itemTleElem.value);var tagCtrl=ebay.oDocument.oPage.controls["seller_tags"];with(tagCtrl){oAjaxListner=processTitleGuidResponse;c=oConfig,iTags=0;sUrl=c.sReqUrl.replaceTokens('7',itemTitle,"","",itemConVal);for(var oTag in oTagControls){tempElem=oTagControls[oTag];if(tempElem.bMultiVal){var bMulValAdd=false;for(k=0;k<tempElem.aTagVals.length;k++){if(tempElem.aTagVals[k].Sel){tempVal+=c.sDelim+encodeURIComponent(tempElem.aTagVals[k].Val);bValAdd=true;bMulValAdd=true;}}
if(bMulValAdd){sUrl+='&selNV_'+iTags+++'='+encodeURIComponent(oTagControls[oTag].name)+tempVal;bMulValAdd=false;tempVal="";}}else{var tv="";if(tempElem.oTagText.eElem)
tv=tempElem.oTagText.eElem.value;if(tv){sUrl+='&selNV_'+iTags+++'='+encodeURIComponent(oTagControls[oTag].name)+c.sDelim+encodeURIComponent(tv);bValAdd=true;}}}
sUrl+='&maxNVSeq='+iTags;if(bValAdd)
oUtils.requestData(sUrl);ebay.oDocument.oPage.bItemFocus=false;}}
function EbaySYI3DepTagControl(pParent,pParentTag,pName,pIndex,pSource,pIsBind,pTagAttr,pMultiVal,pCfg,pChild,pNoTopIncrement)
{if(!this.objType)
this.objType="EbaySYI3DepTagControl";this.base=EbaySYI3TagControl;this.base(pParent,pParentTag,pName,pIndex,pSource,pIsBind,pTagAttr,pMultiVal,pCfg,pChild);this.sChildName=null;var t=this,oTT=t.oTagText;t.aChild=[];if(oTT)
t.bIsClosed?oTT._registerEvent('onchange','parent.getDependentData'):oTT._registerEvent('onblur','parent.getDependentData');var att=t.aTagAttr,aC=att.aChildren,len=aC.length;for(var i=0;i<len;i++)
{var oT=aC[i],sTagName=oT.tn.replace(/\s/g,""),tName=oT.tn,oST=ebay.oP.controls['seller_tags'],oSugTag=null;oST.iTagIndex++;var iTopTagIdx=oST.iTagIndex;if(oST.isMSKUFlow)
{t.oSeq.setValue(parseInt(t.oSeq.getValue())+1);var iTopTagIdx=0,sIdx=pIndex+"_"+i,oSugTag=oST.oSugTagControls[sTagName+sIdx];if(!oSugTag)
{oSugTag=oST.oSugTagControls[sTagName+sIdx]=new EbaySYI3SuggestTagControl(oST,tName+sIdx,sIdx,oST.aTaction.none,true,oT,pCfg,false);oSugTag.oPtagCtrl=t;oSugTag.oSugTag.onclick();}
else
{iTopTagIdx=oSugTag.iTopTagIdx;oSugTag.iTotalTopTag++;}
oSugTag.iTotalTopTag++;oSugTag.oHiddenText.setValue(oSugTag.iTopTagIdx);iTopTagIdx=sIdx+"_"+iTopTagIdx;sTagName=sTagName+iTopTagIdx;tName=tName+iTopTagIdx;if(oT.aChildren)
t.oChild=oST.oTagControls[sTagName]=new EbaySYI3DepTagControl(t.parent,t,oT.tn,oST.iTagIndex,t.iTsrc,true,oT,false,oST.oConfig);}
else
{if(oT.aChildren)
{t.oChild=oST.oTagControls[sTagName]=new EbaySYI3DepTagControl(t.parent,t,oT.tn,oST.iTagIndex,t.iTsrc,true,oT,false,oST.oConfig);t.aChild.push(t.oChild);}
else
{if(oT.bMV)
{var aTagVals=[];var aVals=[];var iOpt=0,len2=oT.Vals.length;for(index=0;index<len2;index++)
{if(index<oST.oConfig.iMaxTopTag||oT.Vals[index].Sel)
aTagVals.push(oT.Vals[index]);else
{aVals[iOpt]=oT.Vals[index];iOpt++;}}
oT.Vals=aVals;t.oChild=oST.oTagControls[sTagName]=new EbaySYI3MultiValueControl(t.parent,oT.tn,oST.iTagIndex,t.iTsrc,true,oT,oST.oTagControls[sTagName]?oST.oTagControls[sTagName].aTagVals:aTagVals,oST.oConfig,t);}
else
{t.oChild=oST.oTagControls[sTagName]=new EbaySYI3TagControl(t.parent,t,tName,iTopTagIdx,t.iTsrc,t.bIsBind,oT,false,oST.oConfig,oSugTag);}
t.aChild.push(t.oChild);}
if(!t.oChild.bNoDropDown&&t.oChild.oTagText.eElem)
{if(!t.bVaries){bDisable=(t.oTagText.getValue()=="-")||(t.oTagText.getValue()=="");t.oChild.oTagText.enable(!bDisable);t.oChild.oTagText.setClass(bDisable?"disableCtrl":"");t.oChild.oRemove.show(!t.oChild.oTagText.eElem.disabled);}}}}
this.getDependentData=function()
{var t=this,pp=t.parent.parent,p=t.parent,sUrl="";oST=pp.objType.is('EbayPage')?pp.controls['seller_tags']:pp;if(p.bTagInOverlay&&!p.bSaveClicked)
return;var sVal=oST.oUtils.trim(t.getValue());if(sVal=="-"||sVal=="")
{len=p.aChild.length;for(var i=0;i<len;i++)
{p.aChild[i].oTagText.enable(false);p.aChild[i].oTagText.setClass("disableCtrl");}
return;}
with(oST)
{var v=t.getValue(),c=oConfig,u=oUtils;v=u.trim(v),iTags=0;if((sCurrentTitle&&v==sCurrentTitle)||v=="")
return;if(c&&oSC.bTitleAJAXEnabled)
{oAjaxListner=p.processDepTags;oCurrentTag=p;var oCtg=ebay.oDocument.getConfig('Selling.Title.SherpaGuidance');if(!oCtg)
oUtils.bShowProgress=true;var sUrl=c.sAJAXUrl.replaceTokens('5',"","","");len=p.aChild.length;for(var i=0;i<len;i++)
p.aChild[i].sSelVal="";for(var oTag in oTagControls){var tv=oTagControls[oTag].sSelVal;if(tv&&!p.isChild(p,oTag))
sUrl+='&selNV_'+iTags+++'='+encodeURIComponent(oTagControls[oTag].name)+c.sDelim+encodeURIComponent(tv);}
sUrl+='&reqNames='+p.getChildName();sUrl+='&maxNVSeq='+(iTags-1);oUtils.requestData(sUrl);}}}
this.isChild=function(pObj,pName)
{var aChildren=pObj.getChildName().split(pObj.parent.oConfig.sDelim);len=aChildren.length;for(var i=0;i<len;i++)
{if(aChildren[i].is(pName))
return true;}
return false;}
this.getChildName=function()
{var t=this;if(t.sChildName)
return t.sChildName;t.setChildName();return t.sChildName;}
this.setChildName=function()
{var t=this,s="",aC=t.aTagAttr.aChildren,len=aC.length;for(var i=0;i<len;i++)
{if(i>0)
s+=t.parent.oConfig.sDelim;s+=encodeURIComponent(aC[i].tn);}
t.sChildName=s;}
this.processDepTags=function(oD)
{var t=this,oTag=t.oCurrentTag,aData=oD.TagNmValLst,l=aData.length,c=t.oConfig,oCTags=oTag.sChildName.split(t.oConfig.sDelim),len=oCTags.length;if(!t.isMSKUFlow)
{for(var i=0;i<len;i++)
{var oC=oCTags[i],oCTName=decodeURIComponent(oC),oCT=t.oTagControls[oCTName.replace(/\s/g,"")];if(!oCT.bNoDropDown)
{t.bindObj(oCT.oTagText);oCT.oTagText.enable(true);oCT.oTagText.setClass("");if(!oCT.bIsClosed)
oCT.oTagText.setValue("");}
if(oCT.bMultiVal)
{oCT.oContainer.setValue("");if(oCT.oTagText&&oCT.oTagText.eElem&&oCT.bIsClosed)
{oSelectParent=oCT.oTagText.eElem.parentElement?oCT.oTagText.eElem.parentElement:oCT.oTagText.eElem.parentNode;oContainer=oSelectParent.parentElement?oSelectParent.parentElement:oSelectParent.parentNode;if(oContainer&&oSelectParent)
oContainer.removeChild(oSelectParent);t.oDocument.clearControl(oCT.oTagText.name);oCT.bNoDropDown=true;}}
oCT.oRemove.show(!oCT.bIsRequired);oCT.sSelVal="";oCT.aOptions=[];oCT.aValues=[];if(!l)
{oCT.aValues.push('<hr style="margin:0px 5px 0px 0px;" />');oCT.aValues.push(oCT.bMultiVal?c.aTexts.addMore:c.aTexts.ownname);}}
for(i=0;i<l;i++)
{var sTnName=aData[i].tn.replace(/\s/g,""),oCTag=t.oTagControls[sTnName];if(oCTag.bMultiVal)
{var aVals=[];oCTag.aTagVals=[];len=aData[i].Vals.length;for(index=0;index<len;index++)
{if(index<c.iMaxTopTag)
oCTag.aTagVals.push(aData[i].Vals[index]);else
{oCTag.aValues.push(aData[i].Vals[index].Val);aVals.push(aData[i].Vals[index]);}}
oCTag.aOptions=aVals;}
else
{var dv=aData[i].Vals;oCTag.aOptions=dv;var oSugCTag=t.oSugTagControls[sTnName];if(oSugCTag)
{oSugCTag.aOptions=dv;oSugCTag.sSelOptionVal="";}}
oCTag.init(oCTag.aOptions,true,false);oCTag.bSuggestionCreated=false;oCTag.bNoDropDown=(oCTag.bMultiVal&&aVals.length==0&&oCTag.bIsClosed)
oCTag.aTagAttr=aData[i];if(c.isValRecom)
{var oArr=oCTag.oDownArrow;if(oArr.eElem)
oArr.eElem.style.display=(oCTag.aTagAttr.Vals.length!=0)?"":"none";}
len=oTag.aChild.length;for(var iInd=0;iInd<len;iInd++)
{if(aData[i].tn==oTag.aChild[iInd].name)
oTag.aChild[iInd].aTagAttr.Vals=aData[i].Vals;}
len=oTag.aTagAttr.aChildren.length;for(var k=0;k<len;k++)
{if(oTag.aTagAttr.aChildren[k].tn==aData[i].tn)
oTag.aTagAttr.aChildren[k]=aData[i];}
if(oCTag.bMultiVal)
{var p=oCTag,oD=t.oDocument,pp=p.parent,oContainer=p.oContainer,sContName=oContainer.name;len=p.aTagVals.length;for(var iarrIdx=0;iarrIdx<len;iarrIdx++)
{if(iarrIdx%2==0)
{oCurrDiv=oD.createElement('div');oCurrDiv.id=sContName+(Math.floor(iarrIdx/2));oContainer.eElem.appendChild(oCurrDiv);}
oCurrDiv.setAttribute((!t.oGlobals.oClient.bIE)?'class':'className','MultiValueDivWidth');oCurrDiv.appendChild(pp.oUtils.getMultiValueCB(p.aTagVals[iarrIdx],sContName+'_cb',(iarrIdx%2==0)));}
oD.clearControl(p.oMultiValCB.name);p.oMultiValCB.bind();p.checkMaxTags();pp.oUtils.getMVHiddenVal(p);pp.oUtils.setHiddenValues(p);}
if(oCTag.bIsClosed)
{if(oCTag.bMultiVal)
{if(!oCTag.bNoDropDown)
{oCTag.aValues.unshift("-");oCTag.bNoDropDown=false;oDDiv=t.oDocument.createElement('div');oDDiv.setAttribute((!t.oGlobals.oClient.bIE)?'class':'className','DropDownPadding');oDDiv.style.clear='both';oDDiv.innerHTML='<select name="'+c.sMVTagTextBoxPrefix+oCTag.pI+'" id="'+c.sMVTagTextBoxPrefix+oCTag.pI+'"></select><span style="margin-left:10px;">'+u.getAddTagBtn(u.sMVContainer+oCTag.pI+"_add",true)+'</span>';oCTag.oTagOuterLayer.eElem.appendChild(oDDiv);oCTag.oTagText=new EbayHTMLSelect(oCTag,c.sMVTagTextBoxPrefix+oCTag.pI);oCTag.oTagText.bind();oCTag.oTagText._registerEvent('onchange','parent.validateTag');oCTag.oAddBtn=new EbayHTMLButton(oCTag,u.sMVContainer+oCTag.pI+'_add');oCTag.oAddBtn.bind();oCTag.oAddBtn._registerEvent("onclick","parent.addClick");}
else
{oClearDiv=t.oDocument.createElement('div');oClearDiv.setAttribute((!t.oGlobals.oClient.bIE)?'class':'className','clr');oCTag.oTagOuterLayer.eElem.appendChild(oClearDiv);return;}}
oCTag.oTagText.clearOptions();len=oCTag.aValues.length;for(var ind=0;ind<len;ind++)
oCTag.oTagText.createOption(oCTag.aValues[ind],oCTag.aValues[ind]);}}
if(aData.length==0)
{len=oTag.aChild.length;for(var i=0;i<len;i++)
{var oCN=oTag.aChild[i];if(oCN)
{oCN.aTagAttr.Vals=[];oCN.oTagText.enable(false);oCN.oTagText.setClass("disableCtrl");oCN.oRemove.show(false);}}}}
else
{if(oTag.aChild&&l>0)
{for(var i=0;i<l;i++)
{var oD=aData[i];len=oTag.aChild.length;for(var j=0;j<len;j++)
{var oCT=oTag.aChild[j];if(oCT.iTname==oD.tn)
{var aVal=oD.Vals;oCT.oSugCtrl.aOptions=aVal;oCT.oSugCtrl.aTagAttr=oD;oTag.parent.oUtils.setTagOptions(oCT,aVal,oCT.bIsClosed,false);}}}}}}}

//54@@m4

ebay.oP.initSellerTags=function()
{var t=this,c=t.parent.getConfig('Selling.SellerTags');if(c)
new EbaySYI3SellerTags(t,'seller_tags',c);}
ebay.oP.initMultiSKUSellerTags=function(){var t=this;new EbaySYI3MultiSkuSellerTags(t,'seller_tags',t.parent.getConfig('Selling.MultiSKUSellerTags'));}

//55@@m4
;(function(){var c={};c.sTagOuterLyrPrefix='TagOuterLayer_';c.sTagNameLyrPrefix='TagName_';c.sDownArrowPrefix='DownArrow_';c.sRemovePrefix='Remove_';c.sCustEditPrefix='Edit_';c.sTagValOptLyrPrefix='TagValueOptionList_';c.sCustomLyrId='AddCustomLnk';c.sCustomOuterLyr='Custom_';c.sCustomNamePrefix='Name_';c.sCustomWarnPrefix='Warnmsg_';c.sCusSugNamePrefix='CustSugName_';c.sCusSugValPrefix='CustSugVal_';c.sCustomRemovePrefix='CusRemove_';c.sTrayId='tray';c.iMVCBDefCount='24';c.sHelpPrefix='Help_';c.sSuppresParam='suppressionList';c.sVarTaginfoParam='variationSpecificsTags';c.aActionIdVals={fullReco:1,gradNames:2,gradVals:3,spellReco:4,depVals:5,fullVals:6};c.sTitleBoxId='title';c.sSugSectionLyr='SuggestedSectionLyr';c.sSugTagPrefix='AddVariation_';c.sSpellUOMPrefix='SpellUOM_'
c.sChildClass='stChild';c.iMaxMVTags='30';c.sActiveClass='activeTag';c.sPassiveClass='passiveTag';c.sGrayOutLayer='lyrProgressIndicator_sec';c.bTitleAJAXEnabled=true;c.sProgressIndicator='lyrProgressIndicator_sec';c.sCellPrefix='mskucell_';c.sDesLyrId='Destination_';c.sVarLyr='variation_';c.sWarningValueId='VarValuemsg_secGrp';ebay.oP.oSellerTagConfig=c;})();var oSC=ebay.oP.oSellerTagConfig;

//56@@m6

function EBayCharCounterConfig(name)
{if(!this.objType)
this.objType="EBayCharCounterConfig";this.base=EbayConfig;this.base(name);this.name=name;this.elemIndex=0;this.formname="";this.inputFieldId="";this.divForTextId="";this.localizeText="";this.singleCharLeft="";this.noCharLeft="";this.maxChars=0;this.autoClear=false;this.anchorId="";}
function Localize(a)
{return a;}
function EbayCharCounter(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbayCharCounter";this.base=EbayBaseControl;this.base(pParent,pName);this.oConfig=pCfg;this.updateCharCount=ebCharCounterUpdateCharCount;this.clearCharCount=ebCharCounterClearCharCount;this.bClearChar=pCfg.bClearText||true;this.bLenRestr=pCfg.bLenRestricted||false;this.oTxt=new EbayHTMLText(pParent,pCfg.inputFieldId,false,pCfg);if(!this.oTxt.eElem)
this.oTxt.bind();this.oLyr=new EbayHTMLLayer(this,pCfg.divForTextId,false,pCfg);var evtTxtFocus=this.oTxt._registerEvent("onfocus");var evtTxtKeyup=this.oTxt._registerEvent("onkeyup");this.oLyr.countChars=function()
{this.parent.updateCharCount();}
this.oLyr._registerListener(evtTxtFocus,this.oLyr.EVENT_AFTER,"countChars");this.oLyr._registerListener(evtTxtKeyup,this.oLyr.EVENT_AFTER,"countChars");if(this.bClearChar)
{var evtTxtBlur=this.oTxt._registerEvent("onblur");this.oLyr.clearChars=function()
{this.parent.clearCharCount();}
this.oLyr._registerListener(evtTxtBlur,this.oLyr.EVENT_AFTER,"clearChars");}}
function ebCharCounterUpdateCharCount()
{var cfg=this.oConfig,oT=this.oTxt;if(!oT.eElem)
oT.bind();var iCharCount=oT.value().length,iMaxChars=parseInt(cfg.maxChars),iCharsRemaining=iMaxChars-iCharCount;var str="";if(iCharsRemaining<=0){if(this.bLenRestr){var oCl=this.oGlobals.oClient;if(oCl.bFirefox)
var iPos=oT.eElem.scrollTop;oT.setValue(oT.getValue().substr(0,iMaxChars));if(oCl.bFirefox)
oT.eElem.scrollTop=iPos;}
str=cfg.noCharLeft;}
else if(iCharsRemaining==1)
str=cfg.singleCharLeft;else
str=cfg.localizeText;if(!this.oLyr.eElem)
this.oLyr.bind();this.oLyr.setValue(str.replaceTokens(iCharsRemaining));}
function ebCharCounterClearCharCount()
{this.oLyr.setValue("");}

//57@@m5

ebay.oP.initGrayout=function()
{var t=this;new EbaySYI3Grayout(t,'grayout_lyr')}
ebay.oP.closeGrayout=function()
{var t=this,ctls=t.controls,gLyr=ctls['grayout_lyr'],oShadow=ctls['shadow_lyr'];if(gLyr)
gLyr.hide();if(oShadow)
oShadow.show(false);}

//58@@m12

function EbaySYI3SwitchFormat(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbaySYI3SwitchFormat";this.base=EbayBaseControl;this.base(pParent,pName);var c=this.oConfig=pCfg;c.bNoSetContent=true;c.bClearValueOnClose=false;this.aSwitchLinks=[];this.oA=[];this.oActiveLink;if(!c.bReviseFlow)
{this.oCloseCallout=new EbayHTMLAnchor(this,oEC.sCloseCalloutLink);this.oCalloutHidden=new EbayHTMLText(this,oEC.sShowCalloutHidden);this.oCalloutLyr=new EbayHTMLLayer(this,oEC.sCalloutLyr);this.oCloseCallout._registerEvent('onclick','parent.closeCallout');}
if(c.bELFlow)
{this.oCPG=new EbayHTMLText(this,oEC.sCpgName);this.oISAPIName=new EbayHTMLText(this,oEC.sIsapiCmdName);this.oLMode=new EbayHTMLText(this,oEC.sLmodeName);}
if(!(c.bELFlow||c.bReviseFlow))
this.oCloseCallout.bind();this.init=function()
{var c=this.oConfig,info=c.aInfo,len=info.length;for(var i=0;i<len;i++)
{var e=info[i],lnk=e.aSwitchLinks,l=lnk.length;var oLyr=new EbayHTMLOverlayContent(this.oA[i],e.sCntLyr,c)
for(var n=0;n<l;n++){var l=this.oA[i];l=new EbayHTMLAnchor(this,lnk[n]);l.oOlyCnt=oLyr;l._registerEvent('onclick','parent.show');l.bind();if(l.eElem){l.eElem.href="#";}}
var oCnt=new EbayHTMLAnchor(this,e.sContinue);oCnt.iAid=e.iAid;var oCancel=new EbayHTMLAnchor(this,e.sCancel);oCnt.subscribeEvents("onkeydown");oCnt._registerEvent('onkeydown','parent.checkEventForContinue');oCnt._registerEvent('onclick','parent.checkEventForContinue');oCancel._registerEvent('onclick','(function(){this.parent.close()})');oLyr.oCnt=oCnt;oLyr.oCancel=oCancel;;if(e.sClose){var oClose=new EbayHTMLAnchor(this,e.sClose);oClose._registerEvent('onclick','(function(){this.parent.close()})');}}}
this.show=function(pEvent)
{var p=this.parent,c=p.oConfig,olay=this.oOlyCnt,e=pEvent.parent.parent.eElem,aLocs=this.oUtils.oPositioning.getOffsetLeftTop(e);var cCfg=ebay.oDocument.getConfig('Selling.Common');c.bOnFocus=cCfg.bOnFocus;c.sStartLyrName=cCfg.sStartLyrName;p.oActiveLink=this;var gLyr=this.oDocument._getControl('grayout_lyr'),sw,sh;if(gLyr)
{var bd=this.oDocument.doc.body,aPageSize=ebay.oUtils.oPositioning.getPageSize(),bStyleOverflow=bd.style.overflow=='hidden',cLyr=this.oDocument.getUIElem('content');;sw=bStyleOverflow?cLyr.scrollWidth:aPageSize[0];sh=bStyleOverflow?cLyr.scrollHeight:aPageSize[1];gLyr.display(sw,sh);}
if(!olay.eElem)
olay.bind();if(!c.isGrdRej){var sLeft=sw/2-225,sTop=aLocs[1]+35;olay.sLeft=(sLeft>=0)?sLeft+'px':aLocs[0]+'px';if(sTop>=0){olay.sTop=sTop+'px';}}
olay.eElem.style.zIndex=111;if(typeof(olay.display)=="undefined")
{olay.eElem.style.top=olay.sTop;olay.eElem.style.left=olay.sLeft;olay.eElem.style.display="block";}
else
olay.display();olay.oCnt.bind();olay.oCancel.bind();}
this.checkEventForContinue=function(e)
{var key=window.event?window.event.keyCode:arguments[2].keyCode;if((e.name=="onkeydown"&&key==13)||(e.name=="onclick"))
this.parent.changeFormat(this);}
this.changeFormat=function(t)
{ebay.oDocument.oPage.bShowAlert=false;var p=t.parent,c=p.oConfig,oFrm=p.parent.controls[oEC.sFormName],oAid=p.parent.controls[oEC.sAidName];p.close();if(!oFrm)
{if(c.sFormName)
oFrm=new EbayHTMLForm(p.parent,c.sFormName);else
oFrm=new EbayHTMLForm(p.parent,oEC.sFormName);}
if(!oAid)
oAid=new EbayHTMLText(p.parent,oEC.sAidName);if(!oFrm.eElem)
oFrm.bind();if(!oAid.eElem)
oAid.bind();oAid.setValue(t.iAid);if(c.bELFlow)
{p.oCPG.setValue(c.iNewCpg);p.oISAPIName.setValue(c.sNewIsapiCmd);p.oLMode.setValue(c.iNewLmode);}
oFrm.submit();}
this.close=function()
{var gLyr=this.oDocument._getControl('grayout_lyr');if(gLyr)
gLyr.hide();if(typeof(this.oActiveLink.oOlyCnt.hide)=="undefined")
this.oActiveLink.oOlyCnt.eElem.style.display="none";else
this.oActiveLink.oOlyCnt.hide();this.oActiveLink.focus(true);}
this.closeCallout=function()
{var p=this.parent,hid=p.oCalloutHidden,lyr=p.oCalloutLyr;if(!hid.eElem)
hid.bind();if(!lyr.eElem)
lyr.bind();hid.setValue('false');lyr.show(false);}
this.init();}
ebay.oP.initSwitchFormat=function()
{var c=this.parent.getConfig('Selling.Describe.SwitchForm');if(c)
new EbaySYI3SwitchFormat(this,'switch_format',c);}

//59@@m19

function EbaySYI3SaveDraft(pParent,pName,pCfg)
{if(!this.objType)
this.objType="EbaySYI3SaveDraft";this.base=EbayBaseControl;this.base(pParent,pName);var t=this,c=t.oConfig=pCfg;t.sListner=null;t.bAutoSaveOn=c.iAutoSaveTime&&c.iAutoSaveTime>0;t.oTimer=null;t.oDisplayTime=new EbayHTMLLayer(t,oEC.sSaveDraftElem);var a=c.aSaveDraftElems,len=a?a.length:0,aSDL=oEC.aSDLater;for(var i=0;i<len;i++)
{var l=new EbayHTMLAnchor(t,a[i]);l.sAid=c.sAIdValue?c.sAIdValue:'72';l._registerEvent('onclick','parent.saveDraftAction');}
if(aSDL)
{len=aSDL.length;for(var i=0;i<len;i++)
{var oSDL=new EbayHTMLAnchor(t,aSDL[i]);oSDL.sAid=c.sSDLaterAid;oSDL._registerEvent('onclick','parent.saveDraftAction');}}
this.saveDraftAction=function()
{ebay.oDocument.oPage.bShowAlert=false;var t=this;var p=t.parent,c=p.oConfig,oP=p.parent,oD=oP.parent,frm=oEC.sFormName,aid=oEC.sAidName;var fE=oP.controls[frm],hE=oP.controls[aid];if(!fE)
fE=new EbayHTMLForm(t,frm);if(!fE.eElem)
fE.bind();if(!hE)
hE=new EbayHTMLText(t,aid);if(!hE.eElem)
hE.bind();hE.setValue(t.sAid);fE.submit();return false;}
with(t)
{if(bAutoSaveOn)
_registerListener(oDocument._getEvent("load"),EVENT_AFTER,"startTimer");if(oConfig.bDraftSaved)
_registerListener(oDocument._getEvent("load"),EVENT_AFTER,"displayTime");}
this.startTimer=function()
{var t=this,cp=t.oUtils.controlPath(t);t.oTimer=setTimeout(cp+".saveDraft()",t.oConfig.iAutoSaveTime*1000);}
this.saveDraft=function(pListner)
{var t=this;clearTimeout(t.oTimer);t.sListner=pListner;t.setDataMonitor();var c=t.oConfig,oRE=t.parent.controls['SYI3-Rules-Engine'];oRE.post(t);}
this.processDataResponse=function(pResp)
{var t=this;with(t)
{var oRE=parent.controls['SYI3-Rules-Engine'];oRE.oDataMonitor.clear();oRE.bIsInProgress=false;displayTime();if(bAutoSaveOn)
startTimer();var sL=sListner;if(sL)
eval(sL+'();');}}
this.displayTime=function()
{var t=this,c=t.oConfig,oDiv=t.oDisplayTime;if(!oDiv.eElem)
oDiv.bind();var dt=new Date(),h=dt.getHours(),m=dt.getMinutes(),ap="";if(c.bIs12HrFormat==true)
{ap=h>=12?'PM':'AM';h=h>=13?h-=12:h;h=h==0?12:h;}
m=m<10?'0'+m:m;var s=h+':'+m+(ap!=""?'&nbsp;'+ap:"");oDiv.setValue('&nbsp;'+c.sSaveDraftTime.replaceTokens(s));dt=null;}
this.setDataMonitor=function()
{var t=this,p=t.parent,oRE=p.controls['SYI3-Rules-Engine'],oDM=oRE.oDataMonitor,oRTE=p.controls['rte'];if(oRTE)
oRTE.updateHTMLSourceElem();oDM.push('title','text');oDM.push('description','textarea');oDM.push('addToDescription','textarea');oDM.push('pictureUrl','hidden');oDM.push('selfHostPictureUrl1','hidden');oDM.push('selfHostPictureUrl2','hidden');oDM.push('selfHostPictureUrl3','hidden');oDM.push('selfHostPictureUrl4','hidden');oDM.push('selfHostPictureUrl5','hidden');oDM.push('selfHostPictureUrl6','hidden');oDM.push('photoDisplayUpgrades','hidden');oDM.push('photoDisplayPackage','hidden');oDM.push('listingDesigner','checkbox');oDM.push('theme','select-one');var oTD=p.controls["Motors.SYI.Change"];if(oTD){if(typeof(oTD.oCfg.bEdmunds)!='undefined'){oDM.push('fromed','hidden');oDM.push('EdmundsDescription','hidden');}
if(typeof(oTD.oCfg.bRelist)!='undefined')
oDM.push('lMode','hidden');oDM.push('startPrice','text');var oElems=oTD.parent.controls['selling'].getElements(),len=oElems.length;for(var i=0;i<len;i++){var oE=oElems[i],type=oE.type;if(type&&type.hasAny('text','select-one','checkbox','radio','textarea'))
oDM.push(oE.name,type);}}}}

//60@@m2

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

//61@@m3

ebay.oP.initInstantOffer=function(){var t=this,pC=t.parent.getConfig("Selling.Describe.CatalogueInstantOffer");if(pC){t.insCfg=pC;t.docDomain="";lnk=new EbayHTMLAnchor(t,pC.sInstantOffer,false,pC);lnk.bind();lnk._registerEvent('onclick','parent.openInstantOffer');t.openInstantOffer=function(){var cCfg=ebay.oDocument.getConfig('Selling.Common');pC.bOnFocus=cCfg.bOnFocus;pC.sStartLyrName=cCfg.sStartLyrName;pC.sUrl+="&ebayAspUsed="+(Math.round(pC.avgPrice)*100);this.parent.openDialog(pC,pC.sUrl);ebay.oP.closeProgressIndicator();ebay.oP.insertCloseBtn();ebay.oP.insertCancelLink();return false;}
t.instantDiv=new EbayHTMLLayer(this,pC.sInstantSale);t.instantDiv.bind();aP=document.getElementById(pC.sAvgPrice);aP.onclick=function(){var d=ebay.oP.instantDiv;if(d){ebay.oP.instantDiv.show();}
return false;}}}
ebay.oP.insertCancelLink=function(){var t=this,c=t.insCfg,overlay=t.controls[c.sLayerElemName],ifrm=overlay.eElem.childNodes[1];var oChildTag=ebay.oD.createElement("div");oChildTag.innerHTML=c.sCnlHTML;ifrm.parentNode.insertBefore(oChildTag,ifrm.nextSibling.nextSibling);cnl=new EbayHTMLAnchor(t,c.sCnlId,false,c);cnl.bind();cnl._registerEvent('onclick','ebay.oP.closeInstantOffer()');}
ebay.oP.insertCloseBtn=function(){var t=this,c=t.insCfg,overlay=t.controls[c.sLayerElemName],ifrm=overlay.eElem.childNodes[1];var oChildTag=ebay.oD.createElement("div");oChildTag.innerHTML=c.sCloseBtn;ifrm.parentNode.insertBefore(oChildTag,ifrm);lnk=new EbayHTMLAnchor(t,c.sInstClose,false,c);lnk.bind();lnk._registerEvent('onclick','ebay.oP.closeInstantOffer()');}
ebay.oP.closeInstantOffer=function()
{var t=this,c=t.insCfg;var overlay=t.controls[c.sLayerElemName];if(overlay){overlay.close();}
t.closeGrayout();return false;}

//62@@m14

ebay.oP.initSpellCheckerAL=function()
{var t=this,c=t.parent.getConfig("Selling.Describe.SpellChecker");if(c)
{t.oSpellCheckMgr=new EbaySpellCheckManager(t,c.sSpellCheckMgrName,c);t.oSpellCheckMgr.onAfterSpellCheckSubmit=t.onAfterSpellCheckSubmit;t.oSpellCheckMgr.onAfterSpellCheckCancel=t.onAfterSpellCheckCancel;}}
ebay.oP.initSpellChecker=function()
{var t=this,oD=t.oDocument,c=oD.getConfig("Selling.Describe.SpellChecker"),cCfg;if(c)
{cCfg=ebay.oDocument.getConfig('Selling.Common');c.bOnFocus=cCfg.bOnFocus;c.sStartLyrName=cCfg.sStartLyrName;t.openDialog(c,'http://pics.ebaystatic.com/aw/pics/tbx/s.gif');var frm=oEC.sFormName;var fm=t.getFormObj(frm);if(!fm.eElem)
fm.bind();fm.sOrigTarget=fm.getTarget();fm.sOrigAction=fm.getAction();var aElem=oEC.sAidName;var aVal=c.sActionValue?c.sActionValue:'43';fm.setElementValue(aElem,aVal);var sAction=fm.getAction();sAction=sAction+(sAction.has('?')>0?'&':'?')+'ej2child=true';fm.setAction(sAction);fm.setTarget(t.oDisplayedOverlay.sIframeName);fm.submit();t.closeProgressIndicator();return false;}}
ebay.oP.onAfterSpellCheckSubmit=function()
{var t=this,c=t.parent.parent.getConfig("Selling.Describe.SpellChecker"),child_c=t.SpellCheckPage.c,sVal='';with(t)
{var oTitle=t.parent.controls[oEC.sTitleId];if(!oTitle)
oTitle=new EbayHTMLText(parent,oEC.sTitleId);if(!oTitle.eElem)
oTitle.bind();if(oTitle.eElem)
{sVal=correctedTexts[child_c.sTitleTxtArea];if(oTitle.eElem.maxLength>0)
sVal=sVal.substr(0,oTitle.eElem.maxLength);oTitle.value(sVal);}
var oSub=new EbayHTMLText(parent,oEC.sSubtitleId);if(oSub)
{oSub.bind();if(oSub.eElem)
{sVal=correctedTexts[child_c.sSubtitleTxtArea];if(oSub.eElem.maxLength>0)
sVal=sVal.substr(0,oSub.eElem.maxLength);oSub.value(sVal);}}
var rte,desc=c.sRTEName?c.sRTEName:'description';rte=t.parent.controls["rte"];var oDesc=rte.controls[desc];if(!oDesc.eElem)
oDesc.bind();oDesc.setValue(correctedTexts[child_c.sDescTxtArea]);if(rte&&rte.isSupported())
rte.oRTEFrame.setHTML(correctedTexts[child_c.sDescTxtArea]);else
oDesc.eElem.focus();parent.clearFormAction(c);var c=parent.parent.getConfig('Selling.Describe.SpellChecker');t.parent.controls[c.sLayerElemName].closeOverlay();parent.closeGrayout();}}
ebay.oP.onAfterSpellCheckCancel=function()
{var t=this,c=t.parent.parent.getConfig("Selling.Describe.SpellChecker");with(t)
{parent.clearFormAction(c);var c=parent.parent.getConfig('Selling.Describe.SpellChecker');t.parent.controls[c.sLayerElemName].closeOverlay();parent.closeGrayout();}}
ebay.oP.clearFormAction=function(pCfg)
{var c=pCfg,frm=oEC.sFormName,aid=oEC.sAidName,t=this,fm=t.controls[frm];if(!fm.eElem)
fm.bind();fm.setTarget(fm.sOrigTarget);fm.setAction(fm.sOrigAction);fm.setElementValue(aid,'');}

//63@@m3

ebay.oP.showProgressIndicator=function()
{var t=this,oPiol=t.controls["lyrProgressIndicator_sec"];if(oPiol)
oPiol.display();}
ebay.oP.closeProgressIndicator=function()
{var t=this,oPiol=t.controls["lyrProgressIndicator_sec"];if(oPiol)
oPiol.closeOverlay();}

//64@@m6

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

//65@@m2

ebay.oP.initSOJTagging=function(pPostCount)
{var c=this.oDocument.getConfig("Selling.SOJTagging");if(document.getElementById('soj'))
document.getElementById('soj').src.replace(/\&amp;/g,'&');if(c)
{c.iEventPostCount=typeof pPostCount!='undefined'?pPostCount:1;new EbaySOJTagging(this,'soj_tagging',c);}}

//66@@m2

var aSOJTagFields=['btnSwitchForm','title','btnAddPic1','btnAddPic2','btnAddPic3','btnAddPic4','galleryPlus','startPrice','duration','binCheck','binPrice','shipService1','shipService2','shipService3','shipFee1','shipFee2','shipFee3','intlShipService1','intlShipService2','intlShipService3','intlShipFee1','intlShipFee2','intlShipFee3','addShipLnk','aShipCalcLnk','shipsWithinDays','returnsAccepted','brMasterChk','aidZ1','aInstantOffer'];

//67@@m54

ebay.oDocument.oPage.onBeforeLoad=function()
{var oD=this.parent,c,btn,chk,frm,lnk,lyr,rad,sel,childSel,txt,req,evt,i,j,k,len,s,val;this.oCurr=ebay.oUtils.oCurrency;this.oHlpLyr=this.curHlpLyr=this.oCharCounter=this.oBtnFindCat=this.oLeafCat=this.oSelCatLyr=this.oAttrLyr=null;this.curLeafCat=[];this.aPicSet=[];this.aShipSet=[];this.iCatPgIdx=1;this.sPSSrchAttrId="3811";this.oCatId=null;this.initGrayout();oLnk=new EbayHTMLAnchor(this,'errFocusId');if(!oLnk.eElem)
oLnk.bind();if(oLnk)
oLnk.focus(true);var mc=oD.getConfig("EZLister.Main");if(mc)
{new EbayHTMLForm(this,mc.sFormName);new EbayHTMLText(this,mc.sIsapiCmdName,false,mc,true);new EbayHTMLText(this,mc.sAidName,false,mc,true);new EbayHTMLText(this,mc.sCpgName,false,mc,true);new EbayHTMLText(this,mc.sLmodeName,false,mc,true);new EbayHTMLText(this,mc.sLoadTimerName,false,mc,true);this.oCatId=new EbayHTMLText(this,mc.sCatElem);if(this.oGlobals.oClient.bMac&&this.oGlobals.oClient.bSafari)
{var spans=document.getElementsByTagName("span"),len=spans.length;for(i=0;i<len;i++)
{var span=spans[i];if((span.className=="btn_whiteRt")||(span.className=="btn_grayRt"))
span.className="";}}
var oChaneCat=new EbayHTMLAnchor(this,mc.sChangeCatLink,false,mc);oChaneCat.onclick=function()
{var p=this.parent,c=this.oConfig,oFrm=p.controls[c.sFormName],oAid=p.controls[c.sAidName];oAid.setValue(c.sChageCatAid);oFrm.submit();}}
var buttons=document.getElementsByTagName("button");len=buttons.length;for(i=0;i<len;i++)
{btn=buttons[i];btn.onmouseover=function()
{this.className="btn_lnkHover";}
btn.onmouseout=function()
{this.className="btn_lnk";}
if(this.oGlobals.oClient.bMac&&this.oGlobals.oClient.bSafari)
btn.style.verticalAlign="middle";}
c=oD.getConfig("EZLister.Help");if(c)
{this.oHlpLyr=new EbayHTMLOverlayContent(this,c.sLyrName,c);var oCloseBtn=new EbayHTMLAnchor(this,c.sHelpCloseLnkName);len=c.aHelpLnks.length;for(i=0;i<len;i++)
{this.bindHelp(c.aHelpLnks[i]);}
oCloseBtn.onclick=function()
{with(this.parent)
{var ifShimElem=oHlpLyr.eElem.getElementsByTagName("IFRAME")[0];if(ifShimElem)
oHlpLyr.eElem.removeChild(ifShimElem);oHlpLyr.show();if(curHlpLyr)
{curHlpLyr.show();curHlpLyr=null;}}
this.parent.oSelectedElem.focus(true);return false;}}
c=oD.getConfig("EZLister.titleCharCounter");if(c)
{this.oCharCounter=new EbayCharCounter(this,c.name,c);this.oCharCounter.oTxt.onblur=null;this.oCharCounter.oTxt.subscribeEvents("onkeypress");this.oCharCounter.oTxt.onkeypress=function()
{var e;if(typeof(event)!="undefined")
e=event;else
e=arguments[1];if(e.keyCode==13)
return false;}}
c=oD.getConfig("EZLister.Categories");if(c)
{var curTab,curCatLyr,curBrowseLeafCat=[];new EbayHTMLText(this,c.sCatTab,false,c,true);this.oLeafCat=new EbayHTMLText(this,c.sLeafCatName,false,c,true);this.oSelCatLyr=new EbayHTMLLayer(this,c.sSelCatLyr);for(i in c.aTabs)
{lyr=new EbayHTMLLayer(this,i,false,c);lyr.oPanel=new EbayHTMLLayer(lyr,c.aTabs[i][0],false,c);lyr.iVal=c.aTabs[i][2];if(c.aTabs[i][1])
{curTab=lyr;curCatLyr=lyr.oPanel;}
lyr.subscribeEvents("onclick");lyr.onclick=function()
{c=this.oConfig;if(curTab)
curTab.setClass("");this.setClass(c.sSelCatTabClass);curTab=this;if(curCatLyr)
curCatLyr.show();this.oPanel.show(true);curCatLyr=this.oPanel;this.parent.controls[c.sCatTab].value(this.iVal);switch(this.name)
{case"sugCatTab":if(this.parent.controls[c.sSugCatName]&&this.parent.controls[c.sSugCatName].eElem)
this.parent.controls[c.sSugCatName].onclick();break;case"browseCatTab":if(curBrowseLeafCat.length>0)
this.parent.getAttrAndFees();break;}
return false;}}
this.oBtnFindCat=new EbayHTMLButton(this,c.sBtnFindCatName,false,c);new EbayHTMLLayer(this,c.sTitleMsgLyr);this.oBtnFindCat.onclick=function()
{c=this.oConfig;val=this.parent.oCharCounter.oTxt.value().trim();lyr=this.parent.controls[c.sTitleMsgLyr];if(val!="")
{lyr.setValue("");s=c.sSugCatUrl+"&keywords="+_win.encodeURIComponent(val)+this.parent.getFeesParams();req=ebay.oServer.createRequest("sug_cat",s,true);req.iResponseType=3;req.registerAsDataListener(this);req.send();}
else
{var pnl=this.parent.controls["sugCatTab"].oPanel;lyr.setValue(c.sBlankTitleMsg);pnl.setValue("");pnl.show();}
return false;}
this.oBtnFindCat.processDataResponse=function(pResp)
{lyr=this.parent.controls["sugCatTab"];c=this.oConfig;this.parent.updateDisplay(pResp);this.parent.bindSugCats();lyr.onclick();}
new EbayHTMLLayer(this,c.aSelCatMsgNames["lyr"],false,c);new EbayHTMLImage(this,c.aSelCatMsgNames["img"],false,null,null,c);new EbayHTMLLayer(this,c.aSelCatMsgNames["txtLyr"],false,c);for(i=1;i<=c.iNumCatBox;i++)
{sel=new EbayHTMLSelect(this,c.sCatName+i,false,c);sel.iLvl=i;if(i==1)
sel.aCatData=c.aInitCatData;sel.onchange=function()
{c=this.oConfig;for(i=c.iNumCatBox;i>this.iLvl;i--)
{childSel=this.parent.controls[c.sCatName+i];if(childSel)
childSel.show();}
val=this.getValue();if((val!="")&&(!this.aCatData[val][1]))
{this.parent.controls[c.aSelCatMsgNames["lyr"]].show();s=c.sBrowseCatUrl+val;req=ebay.oServer.createRequest("browse_cat",s,true);req.iResponseType=3;req.registerAsDataListener(this);req.send();}
else
{with(this.parent)
{controls[c.aSelCatMsgNames["lyr"]].show(true);if(this.aCatData[val][2])
s="success";else
s="disabled";controls[c.aSelCatMsgNames["img"]].source(c.aCatStatus[s][0]);controls[c.aSelCatMsgNames["txtLyr"]].setValue(c.aCatStatus[s][1]);if(!this.aCatData[val][2]&&!controls[c.aBrowseConvertListing])
bindConvertListing(c.aBrowseConvertListing);}
s="";if(this.aCatData[val][2])
{for(var j=1;j<=this.iLvl;j++)
s+=this.parent.controls[c.sCatName+j].getSelectedText()+" ";s=c.sSelCatTxt.replaceTokens(s);}
this.parent.curLeafCat[0]=curBrowseLeafCat[0]=val;this.parent.curLeafCat[1]=curBrowseLeafCat[1]=s;this.parent.curLeafCat[2]=this.aCatData[val][2];if(c.aSelCatValues.length==0)
this.parent.getAttrAndFees(true);c.aSelCatValues=[];}}
sel.processDataResponse=function(pResp)
{c=this.oConfig;if(c.aSelCatValues.length==0)
this.parent.oSelCatLyr.setValue("");childSel=this.parent.controls[c.sCatName+(this.iLvl+1)];if(childSel)
{childSel.show(true);childSel.aCatData=pResp.oJSON;childSel.clearOptions();for(i in childSel.aCatData)
{s=childSel.aCatData[i][0].replaceToken(childSel.aCatData[i][0],"&amp;","&");j=childSel.createOption(i,s+(childSel.aCatData[i][1]?"":" "+c.sHasChildrenDelimiter));}
if(c.aSelCatValues.length>=childSel.iLvl)
{childSel.selectByValue(c.aSelCatValues[childSel.iLvl-1]);childSel.onchange();}}}}}
var t=this,cfg=t.parent.getConfig('Selling.Describe.ItemCondition');if(cfg)
{var oDD=new EbayHTMLSelect(t,cfg.sCondition);var oHlpDiv=new EbayHTMLLayer(t,cfg.divElem);oDD.onchange=function(){var selVal=this.getSelectedValue();var selText='<b>'+this.getSelectedText()+'</b><br/>';if(selVal!=-1){for(val in cfg.aHelpTxtArr){if(cfg.aHelpTxtArr[val].Selct==selVal){oHlpDiv.eElem.getElementsByTagName("DIV")[5].innerHTML=selText+cfg.aHelpTxtArr[val].Value+'<b class="tib-ptr tib-lt"></b>';oHlpDiv.eElem.style.left=(this.width()+70)+'px';if(ebay.oGlobals.oClient.bIE)
oHlpDiv.eElem.style.scrollTop=(window.screenTop+this.eElem.scrollHeight)+'px';else
oHlpDiv.eElem.height=(window.innerHeight+this.eElem.scrollHeight)+'px';oHlpDiv.show(true);}}}else
oHlpDiv.show(false);}}
new EbayAttributeManager(this,"attribute-manager");c=oD.getConfig("EZLister.Attributes");if(c)
{this.oAttrLyr=new EbayHTMLLayer(this,c.sAttrBoxName);this.oAttrLyr.processDataResponse=function(pResp)
{with(this.parent)
{updateDisplay(pResp);toggleDisabledCategoryMessaging(curLeafCat[2]);}
var oAttrMgr=this.parent.controls["attribute-manager"];if(oAttrMgr)
oAttrMgr.init(true);}
new EbayHTMLLayer(this,c.sBoxName,false,c);new EbayHTMLLayer(this,c.sLnkBoxName);var aL=c.sLnkNames,len=aL.length;for(var i=0;i<len;i++)
{var lnk=new EbayHTMLAnchor(this,aL[i],false,c);lnk.onclick=function()
{c=this.oConfig;this.parent.controls[c.sBoxName].show(true);this.parent.controls[c.sLnkBoxName].show(false);this.show();return false;}}}
c=oD.getConfig("EZLister.ProductSearch");if(c)
{if((typeof(c.sPSSrchAttrId)!="undefined")&&(c.sPSSrchAttrId!=""))
this.sPSSrchAttrId=c.sPSSrchAttrId;frm=new EbayHTMLFrame(this,c.sPSIfrmName,c);btn=new EbayHTMLButton(this,c.sBtnProdSrchName,false,c);btn.oTxt=new EbayHTMLText(btn,c.sPSTxtName,false,c);btn.onclick=function()
{c=this.oConfig;if(!this.oTxt.eElem)
this.oTxt.bind();val=this.oTxt.value();s=c.sUrl.replaceTokens(this.parent.iCatPgIdx,val,this.parent.sPSSrchAttrId);if(!frm.eElem)
frm.bind();frm.setSource(s);frm.show(true);return false;}
if(c.bPrdResPrefill){btn.onclick();}
btn.oTxt.subscribeEvents("onkeypress");btn.oTxt.onkeypress=function()
{var e;if(typeof(event)!="undefined")
e=event;else
e=arguments[1];if(e.keyCode==13)
{this.parent.onclick();return false;}}}
c=oD.getConfig("EZLister.FindProduct");if(c)
{lnk=new EbayHTMLAnchor(this,c.sLnkName,false,c);lnk.onclick=function()
{c=this.oConfig;this.parent.controls[mc.sAidName].value(c.sAidValue);this.parent.controls[mc.sFormName].submit();return false;}}
c=oD.getConfig("EZLister.RemoveProduct");if(c)
{lnk=new EbayHTMLAnchor(this,c.sLnkName,false,c);lnk.onclick=function()
{c=this.oConfig;this.parent.controls[c.sAidName].value(c.sAidValue);this.parent.controls[c.sFormName].submit();return false;}}
c=oD.getConfig("EZLister.Pictures");if(c)
{var oPicPopup=new EbayHTMLPopup(this,"addPic_popup",c),oPicUrl=new EbayHTMLText(this,c.sPicUrlName,false,c,true);if(!oPicUrl.eElem)
oPicUrl.bind();var aOrigPicUrls=oPicUrl.value().split(';');for(i=1;i<=c.iMaxPics;i++)
{this.aPicSet[i]=[];if((i==1)&&(c.sStockPhotoUrl!=""))
this.aPicSet[i].sOrigUrl=c.sStockPhotoUrl;else if(aOrigPicUrls[i-1])
this.aPicSet[i].sOrigUrl=aOrigPicUrls[i-1];else
this.aPicSet[i].sOrigUrl="";this.aPicSet[i][c.sPicWellName]=new EbayHTMLImage(this,(c.sPicWellName+i),false,null,null,c);if(!this.aPicSet[i][c.sPicWellName].eElem)
this.aPicSet[i][c.sPicWellName].bind();var lyrPicWell=new EbayHTMLLayer(this,c.sPicWellLyrName+i);if(this.aPicSet[i][c.sPicWellName].source()==c.sCamIconUrl)
{lyrPicWell.idx=i;lyrPicWell.subscribeEvents("onclick");lyrPicWell.onclick=function()
{var popCfg=oPicPopup.oConfig;oPicPopup.idx=this.idx;s=popCfg.sUrl+"&ej2child=true";oPicPopup.showEx(s,popCfg.iWidth,popCfg.iHeight,false,false,false,false,false,false);}}
this.aPicSet[i][c.sPicWellLyrName]=lyrPicWell;this.aPicSet[i][c.sLyrAddPicName]=new EbayHTMLLayer(this,c.sLyrAddPicName+i);this.aPicSet[i][c.sBtnAddPicName]=new EbayHTMLButton(this,(c.sBtnAddPicName+i),false,c);this.aPicSet[i][c.sBtnAddPicName].idx=i;this.aPicSet[i][c.sBtnAddPicName].onclick=function()
{var popCfg=oPicPopup.oConfig;oPicPopup.idx=this.idx;s=popCfg.sUrl+"&ej2child=true";oPicPopup.showEx(s,popCfg.iWidth,popCfg.iHeight,false,false,false,false,false,false);}
this.aPicSet[i][c.sLyrRemPicName]=new EbayHTMLLayer(this,c.sLyrRemPicName+i);this.aPicSet[i][c.sBtnRemPicName]=new EbayHTMLButton(this,(c.sBtnRemPicName+i),false,c);this.aPicSet[i][c.sBtnRemPicName].idx=i;this.aPicSet[i][c.sBtnRemPicName].onclick=function()
{this.parent.removePhoto(this.idx);}}
new EbayHTMLText(this,c.sStockPhotoOptName,false,c,true);new EbayHTMLText(this,c.sGalImgSrcName,false,c,true);chk=new EbayHTMLCheckbox(this,c.sGalPhotoName,false,c);chk.onclick=function()
{c=this.oConfig;with(this.parent)
{chk=controls[c.sGalPhotoName];txt=controls[c.sGalImgSrcName];if(chk.isChecked())
{if(c.sStockPhotoUrl)
txt.value(c.aGalImgSrcVals["stock"]);else
txt.value(c.aGalImgSrcVals["eps"]);}
else
txt.value("");getUpdatedFees();}}
chk=new EbayHTMLCheckbox(this,c.sGalPlusName,false,c);chk.onclick=function()
{this.parent.getUpdatedFees();}
this.oWarnLayer=new EbayHTMLLayer(this,c.sWarnlayer);this.oSubOptimalImage=new EbayHTMLImage(this,c.sSubOptimalImage);this.oWarnMsgLyr=new EbayHTMLLayer(this,c.sWarnMsgLyr);this.iWarnImgCount=0;}
c=oD.getConfig("EZLister.Description.ReadOnly");if(c)
{frm=new EbayHTMLFrame(this,c.sIfrmName,c);frm.bindHTML();txt=new EbayHTMLText(this,c.sSrcName,false,c);txt.bind();var bIsIE=this.oGlobals.oClient.bIE;var frmElem=frm.eElem,eFrmWindow=frmElem.contentWindow,eFrmDocument=bIsIE?eFrmWindow.document:frmElem.contentDocument,eFrmBody=eFrmDocument.body;eFrmBody.innerHTML=txt.value();}
c=oD.getConfig("EZLister.SchedList");if(c)
{rad=new EbayHTMLRadio(this,c.sSchedListName,false,c);rad._registerEvent("onclick","toggleSchedList");rad.toggleSchedList=function()
{c=this.oConfig,isEnabled=(this.getValue()==c.sEnableVal);if(isEnabled)
{this.controls[c.sStartDateName].setClass("");this.controls[c.sStartTimeName].setClass("");this.controls[c.sStTimeMinuteName].setClass("");}
else
{this.controls[c.sStartDateName].setClass(mc.sDisabledClass);this.controls[c.sStartTimeName].setClass(mc.sDisabledClass);this.controls[c.sStTimeMinuteName].setClass(mc.sDisabledClass);}
this.controls[c.sStartDateName].enable(isEnabled);this.controls[c.sStartTimeName].enable(isEnabled);this.controls[c.sStTimeMinuteName].enable(isEnabled);this.parent.getAttrAndFees();}
sel=new EbayHTMLSelect(rad,c.sStartDateName,false,c);sel.onchange=function()
{this.parent.toggleSchedList();}
sel=new EbayHTMLSelect(rad,c.sStartTimeName,false,c);sel.onchange=function()
{this.parent.toggleSchedList();}
sel=new EbayHTMLSelect(rad,c.sStTimeMinuteName,false,c);sel.onchange=function()
{this.parent.toggleSchedList();}}
c=oD.getConfig("EZLister.Shipping");if(c)
{k=0;for(i=1;i<=c.iNumServices;i++)
{this.aShipSet[k]=[];for(j in c.aFieldNames)
{switch(c.aFieldNames[j][1])
{case"menu":this.aShipSet[k][j]=new EbayHTMLSelect(this,c.aFieldNames[j][0]+i,false,c);break;case"text":case"hidden":this.aShipSet[k][j]=new EbayHTMLText(this,c.aFieldNames[j][0]+i,false,c);break;}
if(c.aFieldNames[j][2])
this.aShipSet[k][j].oLyr=new EbayHTMLLayer(this,c.aFieldNames[j][0]+i+"_lyr",false,c);this.aShipSet[k][j].iIdx=k;this.aShipSet[k][j].bind();if(this.aShipSet[k][j].eElem)
this.aShipSet[k][j].bIsIntlDest=(this.aShipSet[k][j].getValue()=="dom"?false:true);}
this.aShipSet[k]["dest"].onchange=function()
{with(this)
{var bIsIntl=false;val=getValue();c=oConfig;switch(val)
{case"ec":parent.aShipSet[iIdx]["loc"].setValue(c.aFieldValues["loc"]["ec"]);parent.aShipSet[iIdx]["shipOpt"].setValue(c.aFieldValues["shipOpt"]["custom"]);bIsIntl=true;break;case"ww":parent.aShipSet[iIdx]["loc"].setValue("");parent.aShipSet[iIdx]["shipOpt"].setValue(c.aFieldValues["shipOpt"]["ww"]);bIsIntl=true;break;}
parent.aShipSet[iIdx]["serv"].oLyr.show(!bIsIntl);parent.aShipSet[iIdx]["fee"].oLyr.show(!bIsIntl);parent.aShipSet[iIdx]["intlServ"].oLyr.show(bIsIntl);parent.aShipSet[iIdx]["intlFee"].oLyr.show(bIsIntl);if(bIsIntlDest&&!bIsIntl)
{parent.aShipSet[iIdx]["intlServ"].selectByIndex(0);parent.aShipSet[iIdx]["intlFee"].value("");}
else if(!bIsIntlDest&&bIsIntl)
{parent.aShipSet[iIdx]["serv"].selectByIndex(0);parent.aShipSet[iIdx]["fee"].value("");}
this.bIsIntlDest=bIsIntl;}}
k++;}
var aServicesLyrs=[];len=c.aShipRowNames.length;for(i=0;i<len;i++)
{aServicesLyrs[i]=new EbayHTMLLayer(this,c.aShipRowNames[i],false,c);aServicesLyrs[i].addServices=function()
{this.setStyle("display","");}}
new EbayHTMLLayer(this,c.aAddShipLnksRowName,false,c);len=c.aAddShipNames.length;for(i=0;i<len;i++)
{lnk=new EbayHTMLAnchor(this,c.aAddShipNames[i],false,c);lnk.onclick=function()
{c=this.oConfig;len=aServicesLyrs.length;var lnkObj=null;for(j=0;j<len;j++)
{aServicesLyrs[j].addServices();}
this.parent.controls[c.aAddShipLnksRowName].show();return false;}}
oHT=new EbayHTMLSelect(this,c.sHandlingTime,false,c);if(!oHT.eElem)
oHT.bind();oHT.onchange=function()
{this.parent.getUpdatedFees();}}
c=oD.getConfig("Selling.Describe.OptionForPayPal");if(c)
this.initOptionForPayPalFormat();c=oD.getConfig("EZLister.MandatoryPayPal");if(c)
{var paymentLocationArr=[],locationTextMapping=[],paymentTextMapping=[];var shipToLocationNames=[],dupPaymentLocationArr=[];var msg,site,infoImg,spaceImg;paymentLocationArr=c.aPaymentLocationMappings;locationTextMapping=c.aLocationTextMapping;paymentTextMapping=c.aPaymentTextMapping;shipToLocationNames=c.aShipToLocationNames;siteOptions=c.aSiteOptions;msg=c.sMsg;site=c.sSite;infoImg=c.infoImage;spaceImg=c.spaceImage;var bExclusion=typeof(c.bExclusion)!='undefined'?c.bExclusion:false;if(bExclusion)
{var selElement=this.selElement=[];sDropValue=c.sDropValue;var oDiv=new EbayHTMLLayer(this,c.sDiv);}
len=shipToLocationNames.length;for(a=0;a<len;a++)
{if(bExclusion)
{selElement[a]=new EbayHTMLSelect(this,shipToLocationNames[a]);if(!selElement[a].eElem)
selElement[a].bind();selElement[a]._registerEvent("onchange","parent.showDiv");selElement[a]._registerEvent("onkeypress","parent.showDiv");}
else
{var selElement=new EbayHTMLSelect(this,shipToLocationNames[a]);selElement.bind();if(selElement.eElem){selElement.onchange=function(){this.parent.displayMandatoryPaymentMessage();}}}}
this.showDiv=function()
{this.parent.displayMandatoryPaymentMessage();var bDrop=false;len=shipToLocationNames.length;for(i=0;i<len;i++)
{if(selElement[i].getSelectedValue().is(sDropValue))
bDrop=true;}
oDiv.show(bDrop);}
len=paymentTextMapping.length;for(b=0;b<len;b+=2)
{var chkElement=new EbayHTMLCheckbox(this,paymentTextMapping[b]);chkElement.bind();if(chkElement.eElem){chkElement.onclick=function(){this.parent.displayMandatoryPaymentMessage();}}}
this.displayMandatoryPaymentMessage=function(){dupPaymentLocationArr=paymentLocationArr;var intlShippingSel=this.intlShippingSelected(shipToLocationNames,siteOptions);if(intlShippingSel)
this.msgConstruction(dupPaymentLocationArr);else{var id="dispMandatoryPaymentMsgs_PaymentWarnings";var spanObj=ebay.oDocument.doc.getElementById(id);if(spanObj)
spanObj.innerHTML="";}}
this.msgConstruction=function(dupPaymentLocationArr)
{var images="<img border='0' src='"+infoImg+"' align='absmiddle' alt=' '><img border='0' src='"+spaceImg+"' height='12' width='5' alt=' '>";var dispMsg="";var divWithPadding="<div style='padding-bottom:5px;'>";var divClose="</div>";len=dupPaymentLocationArr.length;for(var i=0;i<len;i++)
{var locations=dupPaymentLocationArr[i];var payments=dupPaymentLocationArr[++i];var isPaymentSelected=this.isAnyPaymentSelected(payments);if(!isPaymentSelected){var locExpansion=this.setExpansion(locations,locationTextMapping,site,true);if(locExpansion!=''){dispMsg+=msg.replaceTokens(this.setExpansion(payments,paymentTextMapping,site,false),locExpansion);}}}
var id="dispMandatoryPaymentMsgs_PaymentWarnings";var spanObj=ebay.oDocument.doc.getElementById(id);if(spanObj){if(dispMsg!=""){spanObj.innerHTML=divWithPadding+images+dispMsg+divClose;spanObj.style.display="block";}
else
spanObj.innerHTML=dispMsg;}}}
this.isAnyPaymentSelected=function(payments)
{var paymentsArr=payments.split(",");len=paymentsArr.length;for(var a=0;a<len;a++)
{var oCheckElement=new EbayHTMLCheckbox(this.parent,paymentsArr[a]);oCheckElement.bind();if(oCheckElement.eElem&&oCheckElement.isChecked())
return true;else if(!oCheckElement.eElem){var oTextElement=new EbayHTMLText(this.parent,paymentsArr[a]);oTextElement.bind();if(oTextElement.eElem&&oTextElement.eElem.value=='true')
return true;}}
return false;}
this.setExpansion=function(sString,expandedTextArr,site,type)
{var splitStr=sString.split(",");var finalTxt="";len=splitStr.length;for(var j=0;j<len;j++)
{var len2=expandedTextArr.length;for(var k=0;k<len2;k+=2)
{if(expandedTextArr[k]==splitStr[j]&&expandedTextArr[k]!=site){if(!type)
finalTxt+=expandedTextArr[k+1]+" or ";else
finalTxt+=expandedTextArr[k+1]+", ";break;}}}
if(!type)
return finalTxt.substring(0,finalTxt.length-4);else
return finalTxt.substring(0,finalTxt.length-2);}
this.intlShippingSelected=function(shipToLocationNames,siteOptions)
{len=shipToLocationNames.length;for(var j=0;j<len;j++)
{var obj=ebay.oDocument.doc.getElementById(shipToLocationNames[j]);if(obj){if(obj.value==siteOptions)
return true;}}
return false;}
this.bindShipCalc();this.bindPayPal();this.bindPaymentOptions();this.bindCIP();c=oD.getConfig("EZLister.BuyerReqs");if(c)
{chk=new EbayHTMLCheckbox(this,c.sMasterChkName,false,c);chk.onclick=function()
{c=this.oConfig;val=this.isChecked();len=c.aBRSetNames.length;for(i=0;i<len;i++)
{s=val?c.aBRSetNames[i][1]:(c.aBRSetNames[i][1]=="true"?"false":"");this.parent.controls[c.aBRSetNames[i][0]].value(s);}}
len=c.aBRSetNames.length;for(i=0;i<len;i++)
new EbayHTMLText(this,c.aBRSetNames[i][0],false,c,true);}
c=oD.getConfig("EZLister.Fees");if(c)
{new EbayHTMLLayer(this,c.sFinalFeeRow);new EbayHTMLLayer(this,c.sFooterConvertListingLyr);sel=new EbayHTMLSelect(this,c.aFieldNames["duration"],false,c);sel.onchange=function()
{this.parent.getUpdatedFees();}
chk=new EbayHTMLCheckbox(this,c.aFieldNames["bin"],false,c);chk.txtbox=new EbayHTMLText(this,c.aFieldNames["binPrice"],false,c);chk.txtbox.onblur=function()
{this.parent.getUpdatedFees();}
chk.onclick=function()
{with(this)
{if(isChecked())
{txtbox.enable(true);txtbox.setClass("");}
else
{txtbox.enable();txtbox.setClass(mc.sDisabledClass);}
parent.getUpdatedFees();}}
txt=new EbayHTMLText(this,c.aFieldNames["startPrice"],false,c);txt.onblur=function()
{this.parent.getUpdatedFees();}}
c=oD.getConfig("EZLister.Submit");if(c)
{btn=new EbayHTMLButton(this,c.sBtnName,false,c);btn.onclick=function()
{var p=this.parent,rte=p.controls["rte"],oAid=p.controls['aid'];if(rte)
rte.checkHTML();if(!oAid)
oAid=new EbayHTMLText(p,'aid');if(!oAid.eElem)
oAid.bind();oAid.setValue('');}}
c=oD.getConfig("EZLister.ConvertListing");if(c)
{l=c.aElemNames.length;for(i=0;i<l;i++)
{this.bindConvertListing(c.aElemNames[i]);}}
this.initSpellCheckerAL();c=oD.getConfig("Selling.Describe.SaveDraft");new EbaySYI3SaveDraft(this,'save_draft',c);this.initSOJTagging(5);}
ebay.oDocument.oPage.onAfterLoad=function()
{var oD=this.parent,c=oD.getConfig("EZLister.Main");if((typeof(_sT)!="undefined")&&(typeof(_eT)!="undefined"))
{var txt=this.controls[c.sLoadTimerName];if(txt.eElem)
txt.value(Math.abs((_eT-_sT)/1000));}
c=oD.getConfig("EZLister.Categories")
if(c)
{var sel=this.controls[c.sCatName+1];if(c.aSelCatValues.length>0)
{sel.selectByValue(c.aSelCatValues[0]);sel.onchange();}
sel.enable(true);}}
ebay.oDocument.oPage.bindConvertListing=function(pId)
{if(!this.controls[pId])
{var oD=this.parent,c=oD.getConfig("EZLister.ConvertListing"),mc=oD.getConfig("EZLister.Main"),lnk=new EbayHTMLAnchor(this,pId,false,c);lnk.onclick=function()
{c=this.oConfig;with(this.parent)
{controls[mc.sIsapiCmdName].value(c.sNewIsapiCmd);controls[mc.sAidName].value(c.iNewAid);controls[mc.sCpgName].value(c.iNewCpg);if(c.iNewLmode!="")
controls[mc.sLmodeName].value(c.iNewLmode);controls[mc.sFormName].submit();}
return false;}
if(!lnk.eElem)
lnk.bind();}}
ebay.oDocument.oPage.bindHelp=function(pId)
{var oPos=this.oUtils.oPositioning;var lnk=new EbayHTMLAnchor(this,pId+"Hlp");lnk.lyr=new EbayHTMLLayer(this,pId+"Hlp_Txt");lnk.onclick=function(pEvt)
{this.lyr.show(true);this.parent.oSelectedElem=this;with(this.parent)
{oHlpLyr.display();if(curHlpLyr&&(curHlpLyr.name!=this.lyr.name))
curHlpLyr.show();}
var evt=this.oDocument.win.event||pEvt,iEventY;if(evt)
iEventY=evt.clientY;var pos=oPos.getOffsetLeftTop(this.eElem),iLocX=pos[0],iLocY=pos[1],w=iLocX+300,bLeftBubble=(w>document.body.clientWidth)?true:false,iLft=bLeftBubble?iLocX-300:iLocX,lh=this.parent.oHlpLyr.height(),bTopBubble=(iEventY-lh)>0?true:false,iTp=bTopBubble?iLocY-lh:iLocY+this.height();with(this.parent)
{oHlpLyr.sTop=iTp+"px";oHlpLyr.sLeft=iLft+"px";oHlpLyr.setPosition();oHlpLyr.setIframeShim();}
this.parent.curHlpLyr=this.lyr;return false;}
if(!lnk.eElem)
lnk.bind();if(!lnk.lyr.eElem)
lnk.lyr.bind();}
ebay.oDocument.oPage.bindShipCalc=function()
{var oD=this.parent,c=oD.getConfig("EZLister.ShipCalc");if(c)
{var oShipCalcPopup,lnk,len;if(this.controls["shipCalc_popup"])
oShipCalcPopup=this.controls["shipCalc_popup"];else
oShipCalcPopup=new EbayHTMLPopup(this,"shipCalc_popup",c);len=c.aShipCalcLnks.length;for(i=0;i<len;i++)
{if(this.controls[c.aShipCalcLnks[i]])
{lnk=this.controls[c.aShipCalcLnks[i]];oD.clearControl(lnk.name);}
else
{lnk=new EbayHTMLAnchor(this,c.aShipCalcLnks[i],false,c);lnk.onclick=function()
{c=this.oConfig;s=c.sShipCalcUrl;if(this.parent.oCatId)
s=c.sShipCalcUrl.replaceTokens(this.parent.oCatId.getValue());with(oShipCalcPopup)
{sUrl=s;iWidth=c.aShipCalcDims[0];iHeight=c.aShipCalcDims[1];bScrollbars=bResizable=true;bToolbar=bLocation=bMenubar=false;show();}
return false;}}
if(!lnk.eElem)
lnk.bind();}}}
ebay.oDocument.oPage.bindPaymentOptions=function()
{var oD=ebay.oDocument,c=oD.getConfig("EZLister.Payment"),lyr,len,lnk;if(c)
{lyr=new EbayHTMLLayer(this,c.sAddPmtMethodsLyrName,false,c);if(!lyr.eElem)
lyr.bind();lyr=new EbayHTMLLayer(this,c.aAddPmtLnksRowName,false,c);if(!lyr.eElem)
lyr.bind();len=c.aAddPmtNames.length;for(i=0;i<len;i++)
{lnk=new EbayHTMLAnchor(this,c.aAddPmtNames[i],false,c);lnk.onclick=function()
{c=this.oConfig;this.parent.controls[c.sAddPmtMethodsLyrName].show(true);this.parent.controls[c.aAddPmtLnksRowName].show();return false;}
if(!lnk.eElem)
lnk.bind();}}}
ebay.oDocument.oPage.bindCIP=function()
{var oD=ebay.oDocument,c=oD.getConfig("EZLister.Cip"),chk;if(c)
{chk=new EbayHTMLCheckbox(this,c.sMoneyXFerName,false,c);if(!chk.eElem)
chk.bind();chk.childChk=new EbayHTMLCheckbox(chk,c.sCipName,false,c);if(!chk.childChk.eElem)
chk.childChk.bind();chk.onclick=function()
{if(!this.isChecked())
this.childChk.check();}
chk.childChk.onclick=function()
{if(this.isChecked())
this.parent.check(true);}}}
ebay.oDocument.oPage.bindPayPal=function()
{var oD=ebay.oDocument,c=oD.getConfig("EZLister.PayPal"),chk,oRadio,mc=oD.getConfig("EZLister.Main");if(c)
{chk=new EbayHTMLCheckbox(this,c.sPPCheckName,false,c);if(!chk.eElem)
chk.bind();chk.txtBox=new EbayHTMLText(this,c.sPPEmailName,false,c);if(!chk.txtBox||!chk.txtBox.eElem)
chk.txtBox.bind();if(c.sPapayDropDownName)
{chk.oPaypalDrp=new EbayHTMLSelect(this,c.sPapayDropDownName,false,c);chk.oPaypalDrp.subscribeEvents("onclick");if(!chk.oPaypalDrp.eElem)
chk.oPaypalDrp.bind();}
if(c.sRadioName)
{oRadio=new EbayHTMLRadio(this,c.sRadioName,false,c);oRadio.subscribeEvents("onclick");if(!oRadio.eElem)
oRadio.bind();}
if(chk.oPaypalDrp&&oRadio)
{chk.oPaypalDrp.onclick=function()
{with(this)
{oRadio.eElem[0].checked=true;chk.txtBox.setValue("");}}
chk.oPaypalDrp.onchange=function()
{with(this)
{oRadio.eElem[0].checked=true;chk.txtBox.setValue("");}}
oRadio.onclick=function()
{if(oRadio.eElem[0].checked)
{chk.txtBox.setValue("");}}
chk.txtBox.onfocus=function()
{with(this)
{if(oRadio.eElem[1])
oRadio.eElem[1].checked=true;c=oConfig;if(value()==c.sDefaultTxt)
value("");}}}
chk.onclick=function()
{with(this)
{c=oConfig;if(isChecked())
{txtBox.setClass("");txtBox.enable(true);if(chk.oPaypalDrp)
chk.oPaypalDrp.enable(true);if(oRadio)
oRadio.enable(true);}
else
{txtBox.setClass(mc.sDisabledClass);txtBox.enable();if(chk.oPaypalDrp)
chk.oPaypalDrp.enable();if(oRadio)
oRadio.enable();}}}}}
ebay.oDocument.oPage.bindSugCats=function()
{var oD=this.parent,c=oD.getConfig("EZLister.Categories"),s,val,lnk,lyr,rad;rad=new EbayHTMLRadio(this,c.sSugCatName,false,c);oKyHdn=new EbayHTMLText(this,c.sKyHdn);rad.onclick=function()
{c=this.oConfig;val=this.getValue();if(val!="")
{lyr=new EbayHTMLLayer(this,c.sSugCatName+"_"+val+"_lbl");lyr.bind();s=c.sSelCatTxt.replaceTokens(lyr.getValue());this.parent.curLeafCat[0]=val;this.parent.curLeafCat[1]=s;this.parent.curLeafCat[2]=true;this.parent.getAttrAndFees(true);}}
rad.bind();lnk=new EbayHTMLAnchor(this,c.sJumpToBrowseName,false,c);lnk.onclick=function()
{this.parent.controls["browseCatTab"].onclick();return false;}
lnk.bind();}
ebay.oDocument.oPage.toggleDisabledCategoryMessaging=function(pEnabled)
{if(typeof(pEnabled)=="undefined")
return;var oD=this.parent,cFees=oD.getConfig("EZLister.Fees"),cSubmit=oD.getConfig("EZLister.Submit"),feesLyr=this.controls[cFees.sFinalFeeRow],ftrConvertListingLyr=this.controls[cFees.sFooterConvertListingLyr],btn=this.controls[cSubmit.sBtnName];this.oSelCatLyr.show(pEnabled);feesLyr.show(pEnabled);ftrConvertListingLyr.show(!pEnabled);btn.enable(pEnabled);}
ebay.oDocument.oPage.updateDisplay=function(pResp)
{var oXml=pResp.parent.oResponseXml,oX=ebay.oUtils.oXmlHelper,nodes=oX.getNodes(oXml,"node"),bRC=false,bIsJSON=false,bIsEval=false,sId,sStyle,val,selVal,lyr,sel,i,j,aStyles=[],aVals=[];len=nodes.length;if(len>0)
{for(i=0;i<len;i++)
{sId=sStyle="";bRC=false;sId=oX.getAttribValue(nodes[i],"div","id");bIsJSON=(oX.getAttribValue(nodes[i],"div","isJSON")=="true");bIsEval=(oX.getAttribValue(nodes[i],"div","isEval")=="true");if(bIsEval)
{val=oX.getValue(nodes[i],"div");eval(val);}
else if(sId!="")
{if(bIsJSON)
{val=oX.getValue(nodes[i],"div");if(val!="")
{aVals=eval(oX.getValue(nodes[i],"div"));sel=this._getControl(sId);if(!sel)
{sel=new EbayHTMLSelect(this,sId);sel.bind();}
sel.clearOptions();for(j in aVals)
{sel.createOption(j,aVals[j][0]);if(aVals[j][1])
selVal=j;}
sel.selectByValue(selVal);}}
else
{sStyle=oX.getAttribValue(nodes[i],"div","style");bRC=oX.getAttribValue(nodes[i],"div","noReplace")=="true"?false:true;lyr=this.controls[sId];if(!lyr)
{lyr=new EbayHTMLLayer(this,sId);lyr.bind();}
if(lyr.eElem)
{if(sStyle&&(sStyle!=""))
{aStyles=sStyle.split(';');var len2=aStyles.length;for(j=0;j<len2;j++)
{sStyle=aStyles[j].split(':');lyr.setStyle(sStyle[0],sStyle[1]);}}
if(bRC)
{val=oX.getValue(nodes[i],"div");if(val&&(val.length>0))
{lyr.setValue(val);if(this.oGlobals.oClient.bIE&&(val!="&nbsp;"))
lyr.height("100%");var oS=lyr.eElem.getElementsByTagName('SCRIPT'),l=oS.length;for(var k=0;k<l;k++)
eval(oS[k].innerHTML);}}}}}}}}
ebay.oDocument.oPage.getFeesParams=function()
{var oD=this.parent,c=oD.getConfig("EZLister.Fees"),c2=oD.getConfig("EZLister.SchedList"),oP=oD.oPage;if(c)
{var binVal=this.controls[c.aFieldNames["bin"]].isChecked()?this.controls[c.aFieldNames["binPrice"]].value():"0",fldName;var sUrlParams="&"+this.oCharCounter.oTxt.name+"="+_win.encodeURIComponent(this.oCharCounter.oTxt.value())+"&"+c.aFieldNames["startPrice"]+"="+this.controls[c.aFieldNames["startPrice"]].value()+"&"+c.aFieldNames["binPrice"]+"="+binVal+"&"+c.aFieldNames["duration"]+"="+this.controls[c.aFieldNames["duration"]].getSelectedValue()+"&"+c.aFieldNames["photo"]+"="+this.controls[c.aFieldNames["photo"]].value()+"&"+c.aFieldNames["gallery"]+"="+this.controls[c.aFieldNames["gallery"]].isChecked()+"&"+c.aFieldNames["galleryPlus"]+"="+this.controls[c.aFieldNames["galleryPlus"]].isChecked();if(c.aFieldNames["payPalEmail"]&&this.controls[c.aFieldNames["payPalEmail"]])
{if(!this.controls[c.aFieldNames["payPalEmail"]].eElem);this.controls[c.aFieldNames["payPalEmail"]].bind();var val=this.controls[c.aFieldNames["payPalEmail"]].getValue();if(val)
sUrlParams+="&"+c.aFieldNames["payPalEmail"]+"="+_win.encodeURIComponent(val);}
if(c.aFieldNames["paypalEmailRadioOptions"]&&this.controls[c.aFieldNames["paypalEmailRadioOptions"]])
{if(!this.controls[c.aFieldNames["paypalEmailRadioOptions"]].eElem);this.controls[c.aFieldNames["paypalEmailRadioOptions"]].bind();var val=this.controls[c.aFieldNames["paypalEmailRadioOptions"]].getValue();if(val)
sUrlParams+="&"+c.aFieldNames["paypalEmailRadioOptions"]+"="+_win.encodeURIComponent(val);}
if(c.aFieldNames["paypalEmailDropDown"]&&this.controls[c.aFieldNames["paypalEmailDropDown"]])
{if(!this.controls[c.aFieldNames["paypalEmailDropDown"]].eElem);this.controls[c.aFieldNames["paypalEmailDropDown"]].bind();var val=this.controls[c.aFieldNames["paypalEmailDropDown"]].getValue();if(val)
sUrlParams+="&"+c.aFieldNames["paypalEmailDropDown"]+"="+_win.encodeURIComponent(val);}
if(c.aFieldNames["payPal"])
{fldName=c.aFieldNames["payPal"];sUrlParams+="&"+fldName+"="+oP.isPaymentSelected(fldName);}
if(c.aFieldNames["moneyTransfer"])
{fldName=c.aFieldNames["moneyTransfer"];sUrlParams+="&"+fldName+"="+oP.isPaymentSelected(fldName);}
if(c.aFieldNames["Cip"])
{fldName=c.aFieldNames["Cip"];sUrlParams+="&"+fldName+"="+oP.isPaymentSelected(fldName);}
if(c.aFieldNames["Cod"])
{fldName=c.aFieldNames["Cod"];sUrlParams+="&"+fldName+"="+oP.isPaymentSelected(fldName);}
if(c.aFieldNames["Checks"])
{fldName=c.aFieldNames["Checks"];sUrlParams+="&"+fldName+"="+oP.isPaymentSelected(fldName);}
if(c.aFieldNames["moneyOrder"])
{fldName=c.aFieldNames["moneyOrder"];sUrlParams+="&"+fldName+"="+oP.isPaymentSelected(fldName);}
if(c.aFieldNames["seeDesc"])
{fldName=c.aFieldNames["seeDesc"];sUrlParams+="&"+fldName+"="+oP.isPaymentSelected(fldName);}
if(this.controls[c.aFieldNames["shipsWithinDays"]].eElem)
{fldName=c.aFieldNames["shipsWithinDays"];sHTVal=this.controls[c.aFieldNames["shipsWithinDays"]].getSelectedValue();sUrlParams+="&"+fldName+"="+sHTVal;}
else if(c.sHandlingTimeSelectedValue!=null)
{fldName=c.aFieldNames["shipsWithinDays"];sHTVal=c.sHandlingTimeSelectedValue;sUrlParams+="&"+fldName+"="+sHTVal;}
if(c2)
{var schedList=this.controls[c2.sSchedListName],schedListVal=schedList.getValue();sUrlParams+="&"+c2.sSchedListName+"="+schedListVal;if(schedListVal=="true")
{sUrlParams+="&"+c2.sStartDateName+"="+schedList.controls[c2.sStartDateName].getValue()+"&"+c2.sStartTimeName+"="+schedList.controls[c2.sStartTimeName].getValue();if(schedList.controls[c2.sStTimeMinuteName].eElem)
sUrlParams+="&"+c2.sStTimeMinuteName+"="+schedList.controls[c2.sStTimeMinuteName].getValue();}}}
return sUrlParams;}
ebay.oDocument.oPage.getUpdatedFees=function()
{var oD=this.parent,c=oD.getConfig("EZLister.Fees");if(c)
{var s=c.sFeesUrl+this.getFeesParams();req=ebay.oServer.createRequest("get_attr",s,true);req.iResponseType=1;req.registerAsDataListener(this.oAttrLyr);req.send();}}
ebay.oDocument.oPage.getAttrAndFees=function(pReload)
{if(this.oLeafCat)
this.oLeafCat.value(this.curLeafCat[0]);if(this.oSelCatLyr)
this.oSelCatLyr.setValue(this.curLeafCat[1]);if(this.curLeafCat[2])
{var oD=this.parent;if(typeof pReload!='undefined'&&pReload)
{var c=oD.getConfig('EZLister.Main'),oAid=this.controls[c.sAidName],oFrm=this.controls[c.sFormName];oAid.setValue('42');if(!oKyHdn.eElem)
oKyHdn.bind();oKyHdn.setValue(this.oCharCounter.oTxt.getValue());oFrm.submit();}
else
{var c=oD.getConfig("EZLister.Categories"),fc=oD.getConfig("EZLister.Fees");if(c&&fc)
{var s=c.sGetAttrUrl.replaceTokens(this.curLeafCat[0])+this.getFeesParams();var req=ebay.oServer.createRequest("get_attr",s,true);req.iResponseType=1;req.registerAsDataListener(this.oAttrLyr);req.send();}}}
else
this.toggleDisabledCategoryMessaging(this.curLeafCat[2]);}
ebay.oDocument.oPage.updatePhoto=function(pUrl,pIsMinPixel,pIsMinQuality,pIconUrl)
{var oD=this.parent,c=oD.getConfig("EZLister.Pictures");if(c)
{c.aColours={uploaded:"#fff",next:"#fecb00",empty:"#ccc"};var oPicPopup=this.controls["addPic_popup"],idx=oPicPopup.idx,sUrl=this.getThumbUrl(pUrl);this.aPicSet[idx][c.sLyrAddPicName].show();this.aPicSet[idx][c.sLyrRemPicName].show(true);this.aPicSet[idx].sOrigUrl=pUrl;if(idx==1)
{var picFrmLyr=new EbayHTMLLayer(this,c.picFrmLyrName);picFrmLyr.bind();picFrmLyr.setClass(c.picFrmGalleryLyrClass);var picFrmTxt=new EbayHTMLLayer(this,c.picFrmTxt);picFrmTxt.bind();picFrmTxt.show(true);}
this.updateImage(idx,sUrl,"",c.aColours["uploaded"]);this.updatePhotoUrls();if(pIsMinPixel||pIsMinQuality)
this.setWarning(this.aPicSet[idx][c.sPicWellName].eElem,idx,pIsMinPixel,pIsMinQuality,pIconUrl);}}
ebay.oDocument.oPage.setWarning=function(pPicElem,pIdx,pIsMinPixel,pIsMinQuality,pIconUrl)
{var oD=this.parent,c=oD.getConfig("EZLister.Pictures");oDiv=this.oDocument.createElement('div');oDiv.id='warn_'+pIdx;oDiv.innerHTML='<img src="'+c.sWarnIcon+'" alt=" "/>';oDiv.className=c.sWarnIconCss;var pn=pPicElem.parentNode?pPicElem.parentNode.parentNode:pPicElem.parentElement.parentElement;pn.appendChild(oDiv);oDiv.oAddPic=this;oDiv.sTnSrc=pIconUrl;oDiv.onmouseover=function()
{var oAddPic=this.oAddPic,oWarn=oAddPic.oWarnLayer,oWarnIcon=oAddPic.oSubOptimalImage,oWMSG=oAddPic.oWarnMsgLyr,aPos=ebay.oUtils.oPositioning.getOffsetLeftTop(this);if(!oWarn.eElem)
oWarn.bind();oWarn.show(true);oWarn.left((aPos[0]+16)+'px');oWarn.top((aPos[1]+16)+'px');if(!oWarnIcon.eElem)
oWarnIcon.bind();oWarnIcon.source(this.sTnSrc);var sMsg=c.sULList;if(pIsMinPixel)
sMsg+=c.sOpenList+c.sMinPixWarnMsg+c.sCloseList;if(pIsMinQuality)
sMsg+=c.sOpenList+c.sMinQltyWarnMsg+c.sCloseList;sMsg+=c.sCloseULList;if(!oWMSG.eElem)
oWMSG.bind();oWMSG.setValue(sMsg);}
oDiv.onmouseout=function()
{this.oAddPic.oWarnLayer.show(false);}}
ebay.oDocument.oPage.removePhoto=function(pIdx,pSkipFeeUpdate)
{var oD=this.parent,c=oD.getConfig("EZLister.Pictures"),mc=oD.getConfig("EZLister.Main");if(c)
{this.aPicSet[pIdx][c.sLyrAddPicName].show(true);this.aPicSet[pIdx][c.sLyrRemPicName].show();this.aPicSet[pIdx].sOrigUrl="";this.updateImage(pIdx,c.sDefaultPicUrl,"",c.aColours["empty"]);if(pIdx==1)
{var picFrmLyr=new EbayHTMLLayer(this,c.picFrmLyrName);picFrmLyr.bind();picFrmLyr.setClass(c.picFrmLyrClass);var picFrmTxt=new EbayHTMLLayer(this,c.picFrmTxt);picFrmTxt.bind();picFrmTxt.show();if(c.sStockPhotoUrl!="")
{c.sStockPhotoUrl="";this.controls[c.sStockPhotoOptName].value("false");this.controls[c.sGalImgSrcName].value("");if(this.oGlobals.oClient.bIE)
{this.aPicSet[pIdx][c.sPicWellName].setStyle("width","");this.aPicSet[pIdx][c.sPicWellName].setStyle("height","");}
else
{this.aPicSet[pIdx][c.sPicWellName].setStyle("width","auto");this.aPicSet[pIdx][c.sPicWellName].setStyle("height","auto");}
this.aPicSet[pIdx][c.sPicWellName].eElem.onload=null;}}
this.updatePhotoUrls(pSkipFeeUpdate);var oWarnIcon=oD.getUIElem('warn_'+pIdx);if(oWarnIcon)
{var pn=oWarnIcon.parentNode?oWarnIcon.parentNode:oWarnIcon.parentElement;pn.removeChild(oWarnIcon);}}}
ebay.oDocument.oPage.updateImage=function(pIdx,pSrc,pClass,pBgColor)
{var oD=this.parent,c=oD.getConfig("EZLister.Pictures");if(c)
{this.aPicSet[pIdx][c.sPicWellName].source(pSrc);this.aPicSet[pIdx][c.sPicWellName].setClass(pClass);this.controls[c.sPicWellLyrName+pIdx].idx=pIdx;this.controls[c.sPicWellLyrName+pIdx].subscribeEvents("onclick");if(pSrc==c.sCamIconUrl)
{var oPicPopup=this.controls["addPic_popup"];this.controls[c.sPicWellLyrName+pIdx].onclick=function()
{var popCfg=oPicPopup.oConfig;oPicPopup.idx=this.idx;var s=popCfg.sUrl+"&ej2child=true";oPicPopup.showEx(s,popCfg.iWidth,popCfg.iHeight,false,false,false,false,false,false);}}
else
{this.controls[c.sPicWellLyrName+pIdx].onclick=null;}
this.controls[c.sPicWellLyrName+pIdx].bind();try
{if(pBgColor)
this.aPicSet[pIdx][c.sPicWellLyrName].setStyle("backgroundColor",pBgColor);}
catch(e)
{}}}
ebay.oDocument.oPage.updatePhotoUrls=function(pSkipFeeUpdate)
{var oD=this.parent,c=oD.getConfig("EZLister.Pictures");if(c)
{var oPicUrl=this.controls[c.sPicUrlName],src,sUrls="",bCamSet=false;for(var i=1;i<=c.iMaxPics;i++)
{src=this.aPicSet[i][c.sPicWellName].source();if((src!="")&&(src!=c.sDefaultPicUrl)&&(src!=c.sCamIconUrl)&&((c.sStockPhotoUrl=="")||((c.sStockPhotoUrl!="")&&(src!=c.sStockPhotoUrl))))
{sUrls+=(sUrls!=""?";":"")+this.aPicSet[i].sOrigUrl;}
else if((i==1)&&(c.sStockPhotoUrl!=""))
{}
else if(!bCamSet)
{bCamSet=true;this.updateImage(i,c.sCamIconUrl,c.sCamIconCssClass,c.aColours["next"]);}
else
this.updateImage(i,c.sDefaultPicUrl,"",c.aColours["empty"]);}
oPicUrl.value(sUrls);if((typeof(pSkipFeeUpdate)=="undefined")||!pSkipFeeUpdate)
{var cp=this.oUtils.controlPath(this);setTimeout(cp+".getUpdatedFees()",100);}}}
ebay.oDocument.oPage.getThumbUrl=function(pUrl)
{if(!pUrl)
return"";var i=pUrl.lastIndexOf('/'),s1=pUrl.substring(i+1,pUrl.length),s2,s3,j=s1.indexOf('?');s2=j!=-1?s1.substr(0,j):s1;s3=s2.substring(0,s2.indexOf('_')+1)+'0'+s2.substring(s1.lastIndexOf('.'),s2.length);return pUrl.replace(s1,s3);}
ebay.oDocument.oPage.resizeImage=function(pObj)
{var w=pObj.width,h=pObj.height;if((h&&w)&&h>1&&w>1)
{if(h>w)
{if(this.oGlobals.oClient.bIE)
{pObj.style.width=96*w/h;pObj.style.height=96;}
else
{pObj.width=96*w/h;pObj.height=96;}}
else
{if(this.oGlobals.oClient.bIE)
{pObj.style.width=96;pObj.style.height=96*h/w;}
else
{pObj.width=96;pObj.height=96*h/w;}}}}
ebay.oDocument.oPage.createRTE=function()
{var oD=this.parent,c=oD.getConfig("EZLister.Description"),rte;c.bCustomInitSpellcheck=true;c.bTaggingOn=true;rte=new EbayRTE(this,"rte",c);rte.createHTML();c=oD.getConfig("EZLister.Description.Palette");if(c)
new EbayRTEColorPalette(this,c.name,c);}
ebay.oDocument.oPage.selectColor=function(pHex)
{var oD=this.parent,c=oD.getConfig("EZLister.Description.Palette");if(c)
{var palette=this._getControl(c.name);palette.restoreRTEEnv();palette.toggleDisplay(false);var rte=this._getControl("rte");rte.applyCommand("font-color",pHex);rte.setCurrentState();}}
ebay.oDocument.oPage.initProductFinder=function()
{var oD=this.parent,c=oD.getConfig("EZLister.ProductFinder");if(c)
{if((typeof(c.sPSSrchAttrId)!="undefined")&&(c.sPSSrchAttrId!=""))
this.sPSSrchAttrId=c.sPSSrchAttrId;var frm,btn,s,i,e,val;if(!this.controls[c.sPSIfrmName])
{frm=new EbayHTMLFrame(this,c.sPSIfrmName,c);frm.bind();}
else
frm=this.controls[c.sPSIfrmName];if(!this.controls[c.sBtnProdFindName])
{btn=new EbayHTMLButton(this,c.sBtnProdFindName,false,c);btn.bind();}
else
btn=this.controls[c.sBtnProdFindName];btn.onclick=function()
{c=this.oConfig;s=c.sUrl.replaceTokens(this.parent.iCatPgIdx,this.parent.sPSSrchAttrId);var len=c.aAttrId.length;for(i=0;i<len;i++)
{e=oD.doc.getElementById(c.aAttrId[i]);if(e)
{val=e.options[e.selectedIndex].value;s+="&"+c.aAttrId[i]+"="+val;}}
frm.setSource(s);frm.show(true);return false;}}}
ebay.oDocument.oPage.initReturnPolicy=function()
{var oD=this.parent,c=oD.getConfig("EZLister.ReturnPolicy");if(c)
{var chk,txt,len;if(!this.controls[c.sMasterChkName])
{chk=new EbayHTMLCheckbox(this,c.sMasterChkName,false,c);chk.bind();}
else
chk=this.controls[c.sMasterChkName];chk.onclick=function()
{c=this.oConfig;val=this.isChecked();len=c.aRPSetNames.length;for(i=0;i<len;i++)
{s=val?c.aRPSetNames[i][1]:"";this.parent.controls[c.aRPSetNames[i][0]].value(s);}}
len=c.aRPSetNames.length;for(i=0;i<len;i++)
{if(!this.controls[c.aRPSetNames[i][0]])
{txt=new EbayHTMLText(this,c.aRPSetNames[i][0],false,c,true);txt.bind();}}}}
ebay.oDocument.oPage.isPaymentSelected=function(pFldName)
{var oD=this.parent,c=oD.getConfig("EZLister.Fees"),oPmt,v=false;oPmt=oD.getUIElem(pFldName);if(oPmt)
{if(oPmt.type=="checkbox")
{oPmt=new EbayHTMLCheckbox(this,pFldName,false,c);if(!oPmt.eElem)
oPmt.bind();v=oPmt.isChecked();}
else if(oPmt.type=="hidden")
{oPmt=new EbayHTMLText(this,pFldName,false,c,true);if(!oPmt.eElem)
oPmt.bind();v=oPmt.value();}}
return v;}
ebay.oDocument.oPage.getFormObj=function(pName)
{var fr=this.parent._getControl(pName);if(!fr)
{fr=new EbayHTMLForm(this,pName);fr.bind();}
return fr;}
var _win=window;if(typeof _ebayv4enc!='undefined')
_win=_ebayv4enc;

//68@@m4

function EbaySYI3PayPalPreSelectWindow(pParent,pName,pConfig)
{if(!this.objType)
this.objType="EbaySYI3PayPalPreSelectWindow";this.base=EbayBaseControl;this.base(pParent,pName);var c=this.oConfig=pConfig;this.popUpDiv=c.sPopUpDiv;this.sHiddenField=c.sHiddenField;this.sPayPal=c.sPayPal;this.sPayPalEmail=c.sPayPalEmail;this.sEmailDiv=c.sEmailDiv;this.spaypalEmailDropDown=c.spaypalEmailDropDown;this.spaypalEmailRadioOptions=c.spaypalEmailRadioOptions;this.oPopUp=new EbayHTMLLayer(this,this.popUpDiv);if(!this.oPopUp.eElem)
this.oPopUp.bind();this.oPopUp.show(false);this.oCancel=new EbayHTMLAnchor(this,c.sCancel);this.oContinue=new EbayHTMLAnchor(this,c.sContinue);this.oClose=new EbayHTMLAnchor(this,c.sCloseBtn);this.oContinue._registerEvent('onclick','parent.preSelectPayPal');this.oCancel._registerEvent('onclick','parent.setHiddenField');this.oClose._registerEvent('onclick','parent.close');var gLyr=this.oDocument._getControl('grayout_lyr'),sw,sh;if(gLyr)
{var bd=this.oDocument.doc.body,aPageSize=ebay.oUtils.oPositioning.getPageSize(),bStyleOverflow=bd.style.overflow=='hidden',cLyr=this.oDocument.getUIElem('content');sw=bStyleOverflow?cLyr.scrollWidth:aPageSize[0];sh=bStyleOverflow?cLyr.scrollHeight:aPageSize[1];gLyr.display(sw,sh);}
this.close=function(){var gLyr=this.oDocument._getControl('grayout_lyr');if(gLyr)
gLyr.hide();this.parent.oPopUp.show(flase);}
this.preSelectPayPal=function(){this.parent.changeValue();oPayPal=this.oDocument._getControl(this.parent.sPayPal);oPayPalEmail=this.oDocument._getControl(this.parent.sEmailDiv);oPayPalEmailDropDown=this.oDocument._getControl(this.parent.spaypalEmailDropDown);oPaypalEmailRadioOptions=this.oDocument._getControl(this.parent.spaypalEmailRadioOptions);oPayPal.eElem.checked=true;oPayPalEmail.enable(true);oPayPalEmailDropDown.enable(true);oPaypalEmailRadioOptions.enable(true);if(oPayPalEmailDropDown.eElem!=null){oPayPalEmailDropDown.createOption(this.parent.sPayPalEmail,this.parent.sPayPalEmail);oSelIndex=oPayPalEmailDropDown.getIndexByValue(this.parent.sPayPalEmail,'true');oPayPalEmailDropDown.selectByIndex(oSelIndex);}
else
{oPayPalEmail.setValue(this.parent.sPayPalEmail);}}
this.setHiddenField=function(){this.parent.changeValue();}
this.changeValue=function(){oHiddenVar=ebay.oDocument.getUIElem(this.sHiddenField);oHiddenVar.checked=true;this.close();}}
ebay.oP.initOptionForPayPalFormatAL=function()
{var c=this.parent.getConfig('Selling.Describe.OptionForPayPal');if(c)
new EbaySYI3PayPalPreSelectWindow(this,'Option_PayPal',c);}

//69@@m2
;(function(){var c={};c.aSDLater=['lnkSaveForLater'];c.sFormName='ezForm';c.sAidName='aid';c.sTitleId='title';c.sSubtitleId='subtitle';c.sSpellCheckMgrName='EbaySpellCheckMgr';c.sCharityElemName='charityId';c.sCharityLaunchValue='-2';c.sDonationelemName='charityDonationPercent';c.sFormatElemName='format';c.sCloseCalloutLink='lnkCloseCallOut';c.sShowCalloutHidden='showSwitchCallout';c.sCalloutLyr='Callout';c.sIsapiCmdName='MfcISAPICommand';c.sCpgName='cpg';c.sLmodeName='lMode';ebay.oP.oElemConfig=c;})();var oEC=ebay.oP.oElemConfig;
// b=17270698 -->