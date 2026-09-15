const signs = [
 ['白羊座','ARIES','♈','3.21 – 4.19'],['金牛座','TAURUS','♉','4.20 – 5.20'],['双子座','GEMINI','♊','5.21 – 6.21'],['巨蟹座','CANCER','♋','6.22 – 7.22'],['狮子座','LEO','♌','7.23 – 8.22'],['处女座','VIRGO','♍','8.23 – 9.22'],['天秤座','LIBRA','♎','9.23 – 10.23'],['天蝎座','SCORPIO','♏','10.24 – 11.22'],['射手座','SAGITTARIUS','♐','11.23 – 12.21'],['摩羯座','CAPRICORN','♑','12.22 – 1.19'],['水瓶座','AQUARIUS','♒','1.20 – 2.18'],['双鱼座','PISCES','♓','2.19 – 3.20']
];
const $ = id => document.getElementById(id);
signs.forEach(sign=>{sign[2]+='\uFE0E';});
$('zodiacs').innerHTML=signs.map((s,i)=>`<button class="zodiac" type="button" data-sign="${i}" aria-pressed="${i===0}"><span class="zodiac-symbol" aria-hidden="true">${s[2]}</span><span class="zodiac-name">${s[0]}</span><span class="zodiac-dates">${s[3]}</span></button>`).join('');
$('date').textContent=new Date().toLocaleDateString('zh-CN',{month:'2-digit',day:'2-digit'}).replace('/',' / ');
$('weekday').textContent=new Date().toLocaleDateString('zh-CN',{weekday:'long'});
const colors=[['晴空蓝','#CFE1FF'],['青柠绿','#DDF5AA'],['蜜桃粉','#FFD3C8'],['日光黄','#F8E79B'],['鸢尾紫','#DBD3FF'],['薄荷青','#BDE9DF'],['杏子橙','#FFD2A6'],['玫瑰粉','#F3C8DC']];
const messages=[
 '勇敢不必很大声。今天，先为自己迈出一小步。',
 '慢慢来也没关系。你认真感受的日常，都在悄悄发光。',
 '允许自己换个方向。新的风景，常常藏在计划之外。',
 '照顾别人的同时，也记得把温柔留一份给自己。',
 '不必等到万事俱备。你喜欢的事，值得从今天开始。',
 '给今天留一点空白。没做完的事，可以交给明天。',
 '不急着找到所有答案。先听听此刻内心的声音。',
 '把目光收回到自己身上。你的节奏，自有它的意义。',
 '一点好奇心，就能把普通的一天变成小小的探险。',
 '你走过的每一步都算数。今天，也可以停下来看看风景。',
 '让那个特别的念头冒个头。与众不同，也是一种可爱。',
 '把喜欢的小事放大一点。快乐，有时就藏在一杯茶里。',
 '不用表现得时刻明亮。安静的你，也值得被好好对待。',
 '把期待放轻，把日子过实。此刻的小满足，也很珍贵。',
 '愿你有出发的勇气，也有随时休息的自由。',
 '今天，试着对自己宽容一点。成长也需要柔软的空间。'
];
const cities={shanghai:[31.23,121.47,'上海'],beijing:[39.9,116.4,'北京'],guangzhou:[23.13,113.26,'广州'],shenzhen:[22.54,114.06,'深圳'],hangzhou:[30.27,120.16,'杭州'],chengdu:[30.57,104.07,'成都'],wuhan:[30.59,114.3,'武汉'],nanjing:[32.06,118.8,'南京'],chongqing:[29.56,106.55,'重庆'],xian:[34.34,108.94,'西安'],suzhou:[31.3,120.59,'苏州'],tianjin:[39.13,117.2,'天津'],changsha:[28.23,112.94,'长沙'],xiamen:[24.48,118.08,'厦门'],qingdao:[36.07,120.38,'青岛'],kunming:[25.04,102.72,'昆明'],hongkong:[22.32,114.17,'香港'],taipei:[25.03,121.57,'台北']};
let selected=0,flipped=false,weather=null,weatherStatus='empty',place=null,requestId=0,controller=null,activeDay='',timeZone;
const readPreference=k=>{try{return localStorage.getItem(k)}catch{return null}};
const savePreference=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
function dateParts(){return new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',...(timeZone?{timeZone}:{})}).formatToParts(new Date()).reduce((a,p)=>(a[p.type]=p.value,a),{});}
function dateKey(){const p=dateParts();return `${p.year}-${p.month}-${p.day}`;}
function hash(s){let n=2166136261;for(const c of s)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
function daily(){const k=dateKey();return {color:colors[hash(k+':color:'+selected)%colors.length],message:messages[hash(k+':note:'+selected)%messages.length]};}
function updateDate(){const p=dateParts();activeDay=dateKey();$('date').textContent=`${p.month} / ${p.day}`;$('day').textContent=p.year+' · TODAY';$('weekday').textContent=new Intl.DateTimeFormat('zh-CN',{weekday:'long',...(timeZone?{timeZone}:{})}).format(new Date());}
function weatherType(code){if(code===0)return ['晴朗','sun'];if([1,2,3].includes(code))return ['多云','cloud'];if([45,48].includes(code))return ['雾','fog'];if([71,73,75,77,85,86].includes(code))return ['降雪','snow'];if(code>=95)return ['雷雨','storm'];if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code))return ['降雨','rain'];return ['天气变化','other'];}
function advice(){const name=daily().color[0];if(!weather)return weatherStatus==='loading'?'正在听今天的天气说话，寄语已经为你准备好了。':weatherStatus==='error'?'天气暂时没有连上，稍后重试。先把这抹'+name+'带进今天吧。':'选一个城市，或使用定位，让今天的天气给你一点灵感。';
 const {type,temp,rain,high}=weather;
 let tip=type==='storm'?'今天有雷雨，尽量留在室内，让片刻安静为你充电。':type==='snow'?'今天有雪，出门保暖防滑，也给心情留一点柔软。':type==='fog'?'雾气让视线变慢，出门留意路况，今天也不必赶路。':type==='rain'||rain>=60?'今天'+(type==='rain'?'有雨':'可能下雨')+'，记得带伞，把雨声当作慢下来的背景音。':temp>=30||high>=33?'今天偏热，记得补水、避开烈日，把安排放轻一点。':temp<=8?'今天有些冷，穿暖一点，也给自己准备一份热乎乎的小确幸。':type==='sun'?'今天晴朗，适合找个舒适的时段走走，让心情透透气。':'今天云朵作伴，适合按自己的节奏，完成一件喜欢的小事。';
 return tip+' 用一点'+name+'，点亮日常。';}
function outfitRecommendation(){
 if(!weather)return null;
 const {temp,low,high,type,rain}=weather;
 const wet=['rain','storm'].includes(type)||rain>=60;
 let top,bottom,outer,shoes;
 if(temp<=5){top='保暖打底 + 厚毛衣';bottom='加绒长裤';outer='厚羽绒服，搭配围巾';shoes='保暖短靴 + 厚袜';}
 else if(temp<=12){top='长袖打底 + 针织衫';bottom='厚棉长裤或牛仔裤';outer='棉服或厚夹克';shoes='包脚运动鞋 + 棉袜';}
 else if(temp<=20){top='长袖衬衫或薄针织衫';bottom='直筒长裤或牛仔裤';outer='轻夹克或针织开衫';shoes='运动鞋或乐福鞋';}
 else if(temp<26){top='棉质短袖或轻薄衬衫';bottom='轻薄长裤';outer=low<18?'早晚加一件薄夹克':'空调房备一件薄开衫';shoes='透气运动鞋或帆布鞋';}
 else{top='透气棉麻短袖';bottom='宽松薄长裤或短裤';outer=low<20?'早晚备薄衬衫，热时脱下':'户外备轻薄防晒外搭';shoes='透气运动鞋或凉鞋';}
 const reminders=[];
 if(type==='snow'){shoes='防水保暖靴，选防滑鞋底';reminders.push('有雪，出门戴好围巾和手套，注意防滑。');}
 else if(wet){shoes=temp<=12?'防水保暖鞋，选防滑鞋底':'防水包脚鞋，选防滑鞋底';reminders.push(type==='storm'?'有雷雨，备好雨具，尽量减少户外停留。':'备一把折叠伞，避免拖地裤脚和容易湿透的鞋。');}
 else if(type==='sun'&&high>=26){reminders.push('白天偏热，户外可搭配遮阳帽。');}
 if(high-low>=8||high-temp>=8){reminders.push('一天内温差较大，分层穿，升温后方便脱下外层。');}
 const color=daily().color;
 return {basis:`${place?.[2]||'当地'} · 当前 ${temp}° · 今日 ${low}°–${high}°`,items:[['上衣',top],['下装',bottom],['外套',outer],['鞋子',shoes]],note:reminders.join(' '),colorTip:`用${color[0]}的上衣、包包或袜子做一点缀，搭配白色、深蓝或牛仔色。`,color:color[1]};
}
function renderOutfit(){
 const outfit=outfitRecommendation();$('outfitGrid').hidden=!outfit;$('outfitColor').hidden=!outfit;
 if(!outfit){$('outfitGrid').replaceChildren();$('outfitColor').textContent='';$('outfitSummary').textContent=weatherStatus==='loading'?'正在获取天气，马上为你搭配…':weatherStatus==='error'?'天气暂时无法获取，请在上方重试后查看穿搭建议。':'在上方选择城市或使用定位，为你推荐今天的上衣、下装、外套和鞋子。';return;}
 $('outfitSummary').textContent=outfit.basis+(outfit.note?'。'+outfit.note:'。按自己的体感增减衣物。');
 $('outfitGrid').replaceChildren(...outfit.items.map(([label,value])=>{const item=document.createElement('div');item.className='outfit-item';const name=document.createElement('span');name.className='outfit-label';name.textContent=label;const text=document.createElement('strong');text.textContent=value;item.append(name,text);return item;}));
 $('outfitColor').textContent=outfit.colorTip;$('outfitColor').style.setProperty('--outfit-color',outfit.color);
}
function renderCard(){renderOutfit();const s=signs[selected],d=daily();$('frontGlyph').textContent=s[2];$('frontName').textContent=s[0];$('frontEnglish').textContent=s[1];$('backTitle').textContent=s[0]+' · 今日灵感';$('backGlyph').textContent=s[2];$('colorName').textContent=d.color[0];$('colorHex').textContent=d.color[1];$('message').textContent=d.message;$('weatherAdvice').textContent=advice();$('flip').style.setProperty('--accent',d.color[1]);$('flip').setAttribute('aria-label',flipped?'收起'+s[0]+'今日卡片':'翻开'+s[0]+'今日星座卡片');}
function setFlipped(value){flipped=value;$("outfitPanel").hidden=!value;$('flip').classList.toggle('flipped',value);$('flip').setAttribute('aria-pressed',String(value));document.querySelector('.card-front').setAttribute('aria-hidden',String(value));document.querySelector('.card-back').setAttribute('aria-hidden',String(!value));$('cardState').textContent=value?'今日灵感已送达':'等待翻开';renderCard();}
function selectSign(i){if(!Number.isInteger(i)||i<0||i>=signs.length)throw new Error('请选择有效星座');selected=i;savePreference('starMood.sign',String(i));document.querySelectorAll('.zodiac').forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));setFlipped(false);renderCard();}
$('zodiacs').addEventListener('click',e=>{const b=e.target.closest('[data-sign]');if(b)selectSign(Number(b.dataset.sign));});
$('flip').addEventListener('click',()=>setFlipped(!flipped));
function setWeatherStatus(status,text){weatherStatus=status;$('weatherReading').textContent=text;$('retry').hidden=status!=='error'||!place;renderCard();}
function clearRequest(){requestId++;controller?.abort();controller=null;weather=null;}
async function loadWeather(location){clearRequest();place=location;const current=requestId;controller=new AbortController();const c=controller;setWeatherStatus('loading','正在获取'+location[2]+'的今日天气…');const timeout=setTimeout(()=>c.abort(),12000);
 try{const url=new URL('https://api.open-meteo.com/v1/forecast');url.search=new URLSearchParams({latitude:location[0],longitude:location[1],current:'temperature_2m,weather_code',daily:'temperature_2m_max,temperature_2m_min,precipitation_probability_max',timezone:'auto',forecast_days:'1'});const response=await fetch(url,{signal:c.signal});if(!response.ok)throw new Error('天气服务暂时不可用');const data=await response.json();if(current!==requestId)return;if(!Number.isFinite(data.current?.temperature_2m)||!Number.isFinite(data.current?.weather_code)||!data.daily?.time?.[0]||!data.timezone||![data.daily.temperature_2m_max?.[0],data.daily.temperature_2m_min?.[0],data.daily.precipitation_probability_max?.[0]].every(Number.isFinite))throw new Error('天气数据不完整');timeZone=data.timezone;updateDate();if(data.daily.time[0]!==dateKey()||!data.current.time.startsWith(dateKey()))throw new Error('天气日期不匹配');const [label,type]=weatherType(data.current.weather_code);weather={label,type,temp:Math.round(data.current.temperature_2m),high:Math.round(data.daily.temperature_2m_max[0]),low:Math.round(data.daily.temperature_2m_min[0]),rain:data.daily.precipitation_probability_max[0]};weatherStatus='success';const reading=$('weatherReading');reading.replaceChildren();const strong=document.createElement('strong');strong.textContent=weather.temp+'°';reading.append(strong,document.createTextNode(label+' · '+location[2]));const detail=document.createElement('span');detail.className='weather-detail';detail.textContent=`今日 ${weather.low}°–${weather.high}° · 降水概率 ${weather.rain}% · ${data.current.time.slice(11,16)} 更新（当地）`;reading.append(detail);$('retry').hidden=true;renderCard();
 }catch(e){if(current!==requestId)return;weather=null;setWeatherStatus('error','暂时无法获取天气，请重试或换一个城市。');}finally{clearTimeout(timeout);if(current===requestId)controller=null;}}
function chooseCity(key){if(!cities[key])throw new Error('请选择列表中的城市');$('city').value=key;$('locate').disabled=false;$('locate').textContent='使用定位 ↗';savePreference('starMood.city',key);return loadWeather(cities[key]);}
$('city').addEventListener('change',()=>{if($('city').value)chooseCity($('city').value);else{clearRequest();place=null;timeZone=undefined;savePreference('starMood.city','');$('locate').disabled=false;$('locate').textContent='使用定位 ↗';updateDate();setWeatherStatus('empty','选好城市，把今天的天气放进卡片。');}});
$('retry').addEventListener('click',()=>{if(place)loadWeather(place)});
$('locate').addEventListener('click',()=>{if(!navigator.geolocation){setWeatherStatus('error','此浏览器暂不支持定位，请手动选择城市。');return;}clearRequest();place=null;const ticket=requestId;$('locate').disabled=true;$('locate').textContent='定位中…';setWeatherStatus('loading','等待定位授权，也可以手动选择城市。');navigator.geolocation.getCurrentPosition(p=>{if(ticket!==requestId)return;$('locate').disabled=false;$('locate').textContent='重新定位 ↗';$('city').value='';savePreference('starMood.city','');loadWeather([p.coords.latitude,p.coords.longitude,'当前位置']);},e=>{if(ticket!==requestId)return;$('locate').disabled=false;$('locate').textContent='使用定位 ↗';setWeatherStatus('error',e.code===1?'定位未获授权，请手动选择城市。':'暂时定位不到你，请手动选择城市。');},{enableHighAccuracy:false,timeout:10000,maximumAge:300000});});
const savedSign=Number(readPreference('starMood.sign'));selectSign(Number.isInteger(savedSign)&&savedSign>=0&&savedSign<12?savedSign:0);updateDate();renderCard();const savedCity=readPreference('starMood.city');if(cities[savedCity])chooseCity(savedCity);
function refreshDay(){if(dateKey()!==activeDay){updateDate();setFlipped(false);if(place)loadWeather(place);}}
setInterval(refreshDay,60000);setInterval(()=>{if(place&&document.visibilityState==='visible')loadWeather(place)},1800000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refreshDay();});
if(document.modelContext?.registerTool){const lifecycle=new AbortController();try{Promise.resolve(document.modelContext.registerTool({name:'reveal_daily_zodiac_card',title:'翻开今日星座卡',description:'选择一个星座并翻开当天的幸运色、心情寄语、当前城市的天气建议和今日穿搭。',inputSchema:{type:'object',properties:{sign:{type:'string',enum:signs.map(s=>s[0])}},required:['sign'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},async execute(input){if(!input||typeof input.sign!=='string'||Object.keys(input).some(k=>k!=='sign'))throw new Error('请提供一个星座名称');const index=signs.findIndex(s=>s[0]===input.sign);selectSign(index);setFlipped(true);await new Promise(resolve=>setTimeout(resolve,matchMedia('(prefers-reduced-motion: reduce)').matches?0:850));return {sign:signs[selected][0],date:dateKey(),color:daily().color,message:daily().message,weatherAdvice:advice(),outfit:outfitRecommendation()};}},{signal:lifecycle.signal})).catch(()=>{});}catch{}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
