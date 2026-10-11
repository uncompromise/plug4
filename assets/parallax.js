(function(){
  var layers=[].slice.call(document.querySelectorAll('[data-x-element-bg-layer]'));
  if(!layers.length) return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  layers.forEach(function(el){
    var p={}; try{p=JSON.parse(el.getAttribute('data-x-element-bg-layer'))}catch(e){}
    var size=parseFloat(p.parallaxSize||'150')/100;
    el._size=size; el._rev=!!p.parallaxRev;
    el.style.height=(size*100)+'%'; el.style.bottom='auto'; el.style.willChange='transform';
  });
  function update(){
    var vh=window.innerHeight;
    layers.forEach(function(el){
      var box=el.parentNode.getBoundingClientRect();
      var extra=box.height*(el._size-1);
      var t;
      if(reduce){ t=-extra/2; }
      else{
        if(box.bottom<0||box.top>vh) return;
        var prog=(vh-box.top)/(vh+box.height); prog=Math.min(1,Math.max(0,prog));
        if(el._rev) prog=1-prog;
        t=-extra*prog;
      }
      el.style.transform='translate3d(0,'+t.toFixed(1)+'px,0)';
    });
  }
  var ticking=false;
  function onScroll(){ if(!ticking){ticking=true;requestAnimationFrame(function(){ticking=false;update();});} }
  if(!reduce){ window.addEventListener('scroll',onScroll,{passive:true}); }
  window.addEventListener('resize',onScroll);
  update();
})();
