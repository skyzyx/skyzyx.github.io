(()=>{'use strict';let api=fetch('/index.json');const months=["January","February","March","April","May","June","July","August","September","October","November","December"];let $q=document.querySelector('#q');$q.focus();api.then(response=>{return response.json();}).then(data=>{let fuse=new Fuse(data.data.items,getOptions());let $query=document.querySelector('#query');let urlParams=new URLSearchParams(window.location.search);let query=encodeURIComponent(urlParams.get('q')).replace(/%20|\+/g,' ').trim();if(null!==urlParams.get('q')&&''!==urlParams.get('q')){$query.innerHTML=`Most relevant results for “${query}”…`;$q.value=query;$q.select();let results=fuse.search(query);let $results=document.querySelector('#results')
if(results<1){$results.innerHTML=`<hr><p class="f5 f4-m f3-l mt0 lh-copy p-summary entry-summary tc">No relevant results were found.</p>`;return;}
$results.innerHTML=results.map(fetchCallback).join('');}}).catch(e=>{console.log('The API fetch failed.',e);});function getOptions(){return{shouldSort:true,tokenize:false,includeScore:true,includeMatches:true,threshold:0.4,location:0,distance:5,maxPatternLength:32,minMatchCharLength:3,keys:[{name:'title',weight:0.1},{name:'summary.content',weight:0.3},{name:'tags',weight:0.3},{name:'keywords',weight:0.3},{name:'content.plain',weight:0.5},"relativePermalink","aliases","categories","series"]}}
function getScoring(r){let scoring=null;if(0.05>=r.score){scoring="★★★★★";}else if(0.1>=r.score){scoring="★★★★";}else if(0.2>=r.score){scoring="★★★";}else if(0.3>=r.score){scoring="★★";}else if(0.4>=r.score){scoring="★";}
return scoring;}
function fetchCallback(r){if(0===r.matches.length){return '';}else{console.log(r);let scoring=getScoring(r);if(scoring){scoring+=" • ";}else{scoring="";}
let dd=new Date(r.item.published);let printDate=`${dd.getUTCDate()} ${months[dd.getUTCMonth()]} ${dd.getUTCFullYear()}`;return `
        <div class="relative w-100 bg-white nested-copy-line-height">
          <div class="bg-white pv1 pv1-m pv2-ns gray overflow-hidden">
            <h1 class="f3 near-black">
              <a href="${r.item.relativePermalink}" class="link black dim">${r.item.title}</a>
            </h1>
            <span class="f6 db">
              ${scoring}<time class="dt-published published" datetime="${r.item.published}">${printDate}</time> • <span>${r.item.categories[0]}</span>
            </span>
            <p>${r.item.summary.content}</p>
          </div>
        </div>`;}}})();