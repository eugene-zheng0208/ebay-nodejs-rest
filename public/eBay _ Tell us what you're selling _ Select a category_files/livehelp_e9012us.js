//<!--
//1@@m10

var liveHelp_ckTag=0;var liveHelp_bnTag=0;var liveHelp_imgHeight=0;var liveHelp_imgWidth=0;var liveHelp_imgURL=0;var liveHelp_URL=0;var liveHelp=new SyiLiveHelp();function SyiLiveHelp(){this.drawTrigger=__drawTrigger;this.popup=__popup;function __drawTrigger(livehelp_num){var u="undefined",s="";if(typeof(livehelp_num)!=u)
{liveHelp_imgURL=eval("liveHelp_imgURL"+livehelp_num);liveHelp_ckTag=eval("liveHelp_ckTag"+livehelp_num);}
if(liveHelp_imgURL==0){var mpt=new Date();var randnum="mpt="+mpt.getTimezoneOffset()+mpt.getTime();s+="<iframe src=\""+"http"+":"+"//altf"+"arm.medi"+"aplex.com/a"+"d/f"+"m/"+liveHelp_ckTag+"?"+randnum+"\" width=\""+liveHelp_imgWidth+"\" height=\""+liveHelp_imgHeight+"\" marginwidth=\"0\" marginheight=\"0\" hspace=\"0\" vspace=\"0\" frameborder=\"0\" scrolling=\"no\" bordercolor=\"#000000\">";s+="<a href=\""+"http"+":"+"//altf"+"arm.medi"+"aplex.com/a"+"d/c"+"k/"+liveHelp_ckTag+"\" target=\"_help\">";s+="<img src=\""+"http"+":"+"//altf"+"arm.medi"+"aplex.com/a"+"d/b"+"n/"+liveHelp_ckTag+"\"";s+="alt=\"Click here for Live Help\" border=\"0\" align=\"absmiddle\"></a>";s+="</iframe>";document.write(s);s="";}
else
{if(liveHelp_URL==0)
{s+="<a href=\""+"http"+":"+"//alt"+"farm.medi"+"aplex.com/a"+"d/c"+"k/"+liveHelp_ckTag+"\" target=\"_help\" onclick=\"return  liveHelp.popup(this.href,this.target,472,320,'no','no');\">";}
else
{if(typeof(livehelp_num)!=u)
{liveHelp_URL=eval("liveHelp_URL"+livehelp_num);}
s+="<a href=\""+liveHelp_URL+"\" target=\"_help\" onclick=\"return  liveHelp.popup(this.href,this.target,472,320,'no','no');\">";}
s+="<img src=\""+liveHelp_imgURL+"\"";s+="alt=\"Click here for Live Help\" border=\"0\" align=\"absmiddle\"></a>";document.write(s);s="";}}
function __popup(mypage,target,w,h,scroll,no){if(target=="_self")
return false;LeftPosition=(screen.width)?(screen.width-w)/2:0;TopPosition=(screen.height)?(screen.height-h)/2:0;settings='height='+h+',width='+w+',top='+TopPosition+',left='+LeftPosition+',scrollbars='+scroll+',resizable='+no+'';win=window.open(mypage,target,settings);return false;}}
// b=17294892 -->