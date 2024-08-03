/*
    AddFunc Slides JavaScript
*/
window.aFSRunning = [];
var aFSlides = function(el,options,inst){ // inst optional
  var $slideshows = document.querySelectorAll(el), // a collection of all of the slideshows.
  inst = inst ? inst : el.replace(/\W/g, ''), // if no inst, use el and make it alphanumeric.
  $slideshow = {},
  Slideshow = {
    init: function(el,options){
      this.counter = this.counter ? this.counter : 0; // to keep track of the current slide.
      this.interval = this.interval ? this.interval : 0; // to keep track of whether slideshow is running or not.
      this.stopCycle = this.stopCycle ? this.stopCycle : 0; // to keep track of whether the slideshow has been stopped or not.
      this.hovered = this.hovered ? this.hovered : 0; // to keep track of whether the mouse is hovering over the slideshow or not.
      this.paused = this.paused ? this.paused : 0; // to keep track of whether the pause control is set to "pause" or not.
      this.el = el; // current slideshow container.
      this.slider = el.querySelector('.slideset'); // current slideshow.
      this.items = el.querySelectorAll('.slideset>.slide'); // a collection of all of the slides, caching for performance.
      this.numItems = this.items.length; // total number of slides.
      options = options || {}; // if options object not passed in, then set to empty object.
      this.opts = {
        auto: (typeof options.auto === "undefined") ? false : options.auto,
        speed: (typeof options.speed === "undefined") ? 7000
                : options.speed < 1000 ? options.speed * 1000
                : options.speed,
        pauseOnHover: (typeof options.pauseOnHover === "undefined") ? !options.rote : options.pauseOnHover,
        tabs: (typeof options.tabs === "undefined") ? false : options.tabs,
        prevNext: (typeof options.prevNext === "undefined") ? !options.rote : options.prevNext,
        pause: (typeof options.pause === "undefined") ? false : options.pause,
        stoppable: (typeof options.stoppable === "undefined") ? !options.rote : options.stoppable,
        fullScreen: (typeof options.fullScreen === "undefined") ? false : options.fullScreen,
        swipe: (typeof options.swipe === "undefined") ? !options.rote : options.swipe
      };
      window.onload = this.items[0].classList.add('current'); // add .current to first figure.
      window.onload = this.el.classList.add('begin'); // add .begin to slideshow container.
      window.onload = this.el.classList.remove('end'); // add .begin to slideshow container.
      if(this.opts.tabs && this.items.length > 1){
        this.addTabs(this.el);
        this.tabOl = el.querySelector('.aFTabs'),
        this.tabLi = this.tabOl.querySelectorAll('li');
        window.onload = this.tabLi[0].classList.add('current'); // add .current to first tab.
      }
      if(this.opts.prevNext && this.items.length > 1){
        this.addPrevNext(this.el);
      }
      if(this.opts.pause && this.items.length > 1){
        this.addPause(this.el);
      }
      this.addEventListeners(this.el, this.opts.speed, this.stoppable, this.opts.swipe);
      if(this.opts.auto && this.items.length > 1){
        this.autoCycle(this.el, this.opts.speed, this.opts.pauseOnHover);
      }
      if(this.opts.fullScreen){
        this.addFullScreen(this.el);
      }
    },
    showCurrent: function(i,tabs,el){
      // increment or decrement this.counter depending on whether i === 1 or i === -1
      if(i > 0){
        this.counter = (this.counter + 1 === this.numItems) ? 0 : this.counter + 1;
      }else{
        this.counter = (this.counter - 1 < 0) ? this.numItems - 1 : this.counter - 1;
      }
      // remove .current from whichever element currently has it
      // http://stackoverflow.com/a/16053538/2006057
      [].forEach.call(this.items, function(el){
        el.classList.remove('current');
      });
      // add .current to the one item which is supposed to have it
      this.items[this.counter].classList.add('current');
      var that = this;
      if(this.opts.tabs){
        [].forEach.call(this.tabLi, function(el){
          el.classList.remove('current');
        });
        this.tabLi[this.counter].classList.add('current');
      }
      if(this.counter === 0){
        this.el.classList.add('begin');
        this.el.classList.remove('end');
      }else if(this.counter === this.numItems - 1){
        this.el.classList.remove('begin');
        this.el.classList.add('end');
      }else{
        this.el.classList.remove('begin');
        this.el.classList.remove('end');
      }
    },
    changeCurrent: function(i,tabs){
      this.counter = i;
      [].forEach.call(this.items, function(el){
        el.classList.remove('current');
      });
      this.items[i].classList.add('current');
      var that = this;
      if(this.opts.tabs){
        [].forEach.call(this.tabLi, function(el){
          el.classList.remove('current');
        });
        this.tabLi[i].classList.add('current');
        if(this.counter === 0){
          this.el.classList.add('begin');
          this.el.classList.remove('end');
        }else if(this.counter === this.numItems - 1){
          this.el.classList.remove('begin');
          this.el.classList.add('end');
        }else{
          this.el.classList.remove('begin');
          this.el.classList.remove('end');
        }
      }
    },
    autoCycle: function(el,speed){
      // http://stackoverflow.com/questions/35496761/how-do-i-prevent-my-setinterval-from-multiplying/35499303
      var that = this;
      this.interval = setInterval(function(){
        if((that.stopCycle != 1) && (that.hovered != 1)){
          that.showCurrent(1); // increment & show
        }
      }, speed);
    },
    addEventListeners: function(el,stoppable,speed){
      var
      that = this,
      speed = that.opts.speed;
      console.log(that.numItems);
      if(that.opts.tabs){
        console.log(that.numItems);
        for(i = 0; i < that.numItems; i++){
          that.tabLi[i].liNum = i; // http://forums.htmlhelp.com/index.php?s=0efb3e5e6bb2e78c68f674d57830b581&showtopic=746&view=findpost&p=3254
          console.log(that.tabLi[i].liNum);
          that.tabLi[i].addEventListener('click', function(){
            that.changeCurrent(this.liNum);
            if(that.opts.stoppable){
              that.stopCycle = 1;
              el.classList.add('stopped');
              return that.stopCycle;
            }
          }, false);
        }
      }
      if(that.opts.prevNext){
        el.querySelector('.next').addEventListener('click', function(){
          that.showCurrent(1); // increment & show
          if(that.opts.stoppable){
            that.stopCycle = 1;
            el.classList.add('stopped');
            return that.stopCycle;
          }
        }, false);
        el.querySelector('.prev').addEventListener('click', function(){
          that.showCurrent(-1); // decrement & show
          if(that.opts.stoppable){
            that.stopCycle = 1;
            el.classList.add('stopped');
            return that.stopCycle;
          }
        }, false);
      }
      if(that.opts.pauseOnHover){
        el.addEventListener('mouseover', function(){
          that.hovered = 1;
          return that.hovered;
        }, false);
        el.addEventListener('mouseout', function(){
          that.hovered = 0;
          return that.hovered;
        }, false);
      }
      if(that.opts.pause){
        el.querySelector('.pause').addEventListener('click', function(){
          if((that.paused === 0)&&(that.stopCycle != 1)){
            that.stopCycle = 1;
            that.paused = 1;
            el.classList.add('paused');
            return that.stopCycle,that.paused;
          }
          else if((that.paused === 1)||(that.stopCycle === 1)){
            that.stopCycle = 0;
            that.paused = 0;
            el.classList.remove('paused');
            el.classList.remove('stopped');
            that.interval;
            return that.stopCycle,that.paused;
          }
        }, false);
      }
      if(that.opts.swipe){
        var that = this, startX = 0, startY = 0, moveX = 0, moveY = 0, diffX = 0, diffY = 0, reset = 0;
        that.slider.addEventListener('touchstart', function(e){
          startX = e.changedTouches[0].pageX;
          startY = e.changedTouches[0].pageY;
        }, false);
        that.slider.addEventListener('touchmove', function(e){
          moveX = e.changedTouches[0].pageX;
          moveY = e.changedTouches[0].pageY;
          diffX = moveX - startX;
          diffY = moveY - startY;
          if(reset != 1){
            if((that.opts.swipe === "any")){
              if((diffX < -100)||(diffY < -100)){
                that.showCurrent(1); // increment & show
                that.stopCycle = 1;
                if(that.opts.stoppable){
                  el.classList.add('stopped');
                }
                reset = 1;
                return reset,that.stopCycle;
              }
              if((diffX > 100)||(diffY > 100)){
                that.showCurrent(-1); // decrement & show
                that.stopCycle = 1;
                if(that.opts.stoppable){
                  el.classList.add('stopped');
                }
                reset = 1;
                return reset,that.stopCycle;
              }
            }
            else if((that.opts.swipe === "vertical")||(that.opts.swipe === "updown")){
              if(diffY > 0){
                if((diffX > 0)&&(diffY > diffX)){
                  e.preventDefault();
                }
                if((diffX < 0)&&((0 - diffY) < diffX)){
                  e.preventDefault();
                }
              }
              if(diffY < 0){
                if((diffX < 0)&&(diffY < diffX)){
                  e.preventDefault();
                }
                if((diffX > 0)&&(diffY < (0 - diffX))){
                  e.preventDefault();
                }
              }
              if(diffY < -100){
                that.showCurrent(1); // increment & show
                that.stopCycle = 1;
                if(that.opts.stoppable){
                  el.classList.add('stopped');
                }
                reset = 1;
                return reset,that.stopCycle;
              }
              if(diffY > 100){
                that.showCurrent(-1); // decrement & show
                that.stopCycle = 1;
                if(that.opts.stoppable){
                  el.classList.add('stopped');
                }
                reset = 1;
                return reset,that.stopCycle;
              }
            }
            else if((that.opts.swipe === "both")||(that.opts.swipe === "all")){
              if((diffX < -100)||(diffY < -100)){
                that.showCurrent(1); // increment & show
                that.stopCycle = 1;
                if(that.opts.stoppable){
                  el.classList.add('stopped');
                }
                reset = 1;
                return reset,that.stopCycle;
              }
              if((diffX > 100)||(diffY > 100)){
                that.showCurrent(-1); // decrement & show
                that.stopCycle = 1;
                if(that.opts.stoppable){
                  el.classList.add('stopped');
                }
                reset = 1;
                return reset,that.stopCycle;
              }
              e.preventDefault();
            }
            else{ // Horizontal - Default
              if(diffX > 0){
                if((diffY > 0)&&(diffX > diffY)){
                  e.preventDefault();
                }
                if((diffY < 0)&&((0 - diffX) < diffY)){
                  e.preventDefault();
                }
              }
              if(diffX < 0){
                if((diffY < 0)&&(diffX < diffY)){
                  e.preventDefault();
                }
                if((diffY > 0)&&(diffX < (0 - diffY))){
                  e.preventDefault();
                }
              }
              if(diffX < -100){
                that.showCurrent(1); // increment & show
                that.stopCycle = 1;
                if(that.opts.stoppable){
                  el.classList.add('stopped');
                }
                reset = 1;
                return reset,that.stopCycle;
              }
              if(diffX > 100){
                that.showCurrent(-1); // decrement & show
                that.stopCycle = 1;
                if(that.opts.stoppable){
                  el.classList.add('stopped');
                }
                reset = 1;
                return reset,that.stopCycle;
              }
            }
          }
        }, false);
        that.slider.addEventListener('touchend', function(){
          if(that.opts.stoppable != true){
            setTimeout(function(){that.stopCycle = 0; return that.stopCycle;},speed);
          }
          reset = 0;
        }, false);
      }
      document.addEventListener('keydown', function(e){
        if(e.which === 37){
          that.showCurrent(-1); // decrement & show
          if(that.opts.stoppable){
            that.stopCycle = 1;
            el.classList.add('stopped');
            return that.stopCycle;
          }
        }else if(e.which === 39){
          that.showCurrent(1); // increment & show
          if(that.opts.stoppable){
            that.stopCycle = 1;
            el.classList.add('stopped');
            return that.stopCycle;
          }
        }
      }, false);
    },
    addTabs: function(el,tabs){
      if(el.querySelector('.aFTabs')){ // check if .tabs already exists
      }
      else{ // build and inject tabs/pagenation controls
        var divTabs = document.createElement('ol');
        divTabs.classList.add('aFTabs');
        divTabs.classList.add('empty-tabs');
        for (i = 0; i < this.numItems; i++){
          var tab = document.createElement('li');
          divTabs.appendChild(tab);
        }
        el.appendChild(divTabs);
      }
    },
    addPrevNext: function(el){
      // build and inject prev/next controls
      var divPrevNext = document.createElement("div"),
      spanPrev = document.createElement("span"),
      spanNext = document.createElement("span");
      divPrevNext.classList.add('prev-next-control');
      spanPrev.classList.add('prev');
      spanNext.classList.add('next');
      spanPrev.innerHTML = 'Previous';
      spanNext.innerHTML = 'Next';
      divPrevNext.appendChild(spanPrev);
      divPrevNext.appendChild(spanNext);
      // append elements to fragment, then append fragment to DOM
      el.appendChild(divPrevNext);
    },
    addPause: function(el){
      // build and inject pause control
      var divPause = document.createElement("div"),
      spanPause = document.createElement("span");
      divPause.classList.add('pause-control');
      spanPause.classList.add('pause');
      spanPause.innerHTML = 'Pause';
      divPause.appendChild(spanPause);
      el.appendChild(divPause);
    },
    addFullScreen: function(el){
      var that = this,
      fsControl = document.createElement("div");
      fsToggle = document.createElement("span");
      fsControl.classList.add('fullscreen-control');
      fsToggle.classList.add('toggle-fullscreen');
      fsToggle.innerHTML = 'Fullscreen';
      fsControl.appendChild(fsToggle);
      el.appendChild(fsControl);
      el.querySelector('.toggle-fullscreen').addEventListener('click', function(){
        that.toggleFullScreen(el);
      }, false);
    },
    toggleFullScreen: function(el){
      // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
      if(!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement &&
      !document.msFullscreenElement){  // current working methods
        if(document.documentElement.requestFullscreen){
          el.requestFullscreen();
        }else if(document.documentElement.msRequestFullscreen){
          el.msRequestFullscreen();
        }else if(document.documentElement.mozRequestFullScreen){
          el.mozRequestFullScreen();
        }else if(document.documentElement.webkitRequestFullscreen){
          el.webkitRequestFullscreen(el.ALLOW_KEYBOARD_INPUT);
        }
      }else{
        if(document.exitFullscreen){
          document.exitFullscreen();
        }else if(document.msExitFullscreen){
          document.msExitFullscreen();
        }else if(document.mozCancelFullScreen){
          document.mozCancelFullScreen();
        }else if(document.webkitExitFullscreen){
          document.webkitExitFullscreen();
        }
      }
    } // end toggleFullScreen
  }; // end Slideshow object .....
  // make instances of Slideshow as needed
  [].forEach.call($slideshows, function(el){
    $slideshow = Object.create(Slideshow);
    $slideshow.init(el, options);
  });
  window.aFSRunning[inst] = 1; // flag for setInterval, so we can ensure we only start it once.
};
startSlides = function(inst){ // inst: selector, used to select a script tag you want to activate.
  var script = document.querySelector(inst);
  eval(script.innerHTML);
};
