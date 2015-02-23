$(function() {
  var manualClick = false;
  var fresh = true;
  var default_page_id = "page_index";
  var num_pages = $('.pages .page').length;
  
  var box1 = $('.box-1');
  var box2 = $('.box-2');
  
  FastClick.attach(document.body);
  
  document.ontouchmove = function(event){
    event.preventDefault();
  }
  
  if (window.navigator.standalone) {
    $('.arrow').hide();
  }
  
  init();
  $(window).resize(init);
  
  function idFromPath(path) {
    if (path != "/") {
      return path.replace("/p/", "page_");
    } else {
      return default_page_id;
    }
  }
  
  function pathFromId(id) {
    return "/p/" + id.replace("page_", "");
  }
  
  function init() {
    var height = $(window).height();
    var width = $(window).width();
  
    $('body').css('height', height + "px");
  
    $('.box').each(function(i) {  
      $(this).css({ 
        height: height + "px",
        width: width + "px",
        'z-index': "-" + i
      });
    });
  
    $('.page').each(function(i) {
      $(this).css({
        height: height + "px",
        width: width + "px",
        lineHeight: height-50 + "px"
      });
    });
  }
  
  var History = window.History;
  
  if (History.enabled) {
    
    State = History.getState();
    // set initial state to first page that was loaded
    History.pushState({page_id: idFromPath(window.location.pathname)}, $("title").text(), State.urlPath);
    changePage(State);
    
  } else {
    return false;
  }
  
  // Bind to StateChange Event
  History.Adapter.bind(window, 'statechange', function() {
    changePage(History.getState());
    manualClick = false;
  });
  
  $('body').on('click', '.box-1', function() {
    var state = History.getState();
    console.log("clicked, getting state page id:" + state.data.page_id);
    var page = $("#" + state.data.page_id);
    next_page_id = page.attr("data-next");
    manualClick = true;
    History.pushState({ page_id: next_page_id }, $('title').text(), pathFromId(next_page_id));
  });
  
  function changePage(state) {
    console.log("Changing page...");
    
    // First page, only fires once
    if (fresh == true) {
      fresh = false;
      
      var page = $('#' + state.data.page_id);
      var page_next = $('#' + page.attr("data-next"));

      box1.append(page);
      box2.append(page_next);
      
      $('.box .page').show();
      
      return;
    }
    
    if (manualClick == false) {
      
      $('.pages')
        .append($('.box .page').hide());
      
      var page = $('#' + state.data.page_id);
      var page_next = $('#' + page.attr("data-next"));

      box1.append(page);
      box2.append(page_next);
      
      $('.box .page').show();
      
      return;
    }
    
    var page = box1.find('.page');
    var page_next = $('#' + page.attr("data-next"));
    var page_after = $('#' + page_next.attr("data-next"));
    
    box2.append(page_next);
    
    $('.box .page').show();
    
    box1.addClass('zoomOutSlideLeft');
    box2.addClass('slideLeftZoomIn');
    
    box2.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      
      console.log("Finished animating.");
      
      box1
        .append(page_next)
        .removeClass('zoomOutSlideLeft');
        
      box2
        .html(page_after)
        .removeClass('slideLeftZoomIn');
        
      $('.pages').append(page.hide());
      
      $('.box .page').show();
      
    });
    
  }
  
});
