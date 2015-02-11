$(document).ready(function(){

  browserDetect();
  greyOut('#screen');
  orientation();
  gyroscope();
  var roof;
  var roofId;
  var lat;
  var long;
  var angle;
  var material;
  var shader_interval;

  function getPosition(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
  }

  navigator.geolocation.getCurrentPosition(getPosition)

  // Add selected class to 
  // clicked material icons
  $('.material_icon').click(function() {
    $('.material_icon').removeClass('selected');
    $(this).addClass('selected');
    material = this.innerHTML;
  });

  // Update shade percent on slider change
  $('#shader').change(function() {
    $('#shade').text($(this).val() + "%");
  });
  
  $('body').on("touchstart", "#shader", function() {
    var el = $(this);
    shader_interval = setInterval(function() {
      $('#shade').text(el.val() + "%");
    }, 50);
  });

  $('body').on("touchend", "#shader", function() {
    clearInterval(shader_interval);
  });

  // POST orientation and geolocation
  $('#toPageSix').click(function() {
    orient = document.getElementById('compass').innerHTML;
    $.post('/roofs/new', { orientation: orient })
      .then(function(data) {
        response = $.parseJSON(data);
        roofId = response.id;
        return roofId;
      })
      .then(function(roofId) {
        console.log(lat)
        console.log(long)
        $.post('/roofs/' + roofId + '/geolocation', { latitude: lat, longitude: long })
      .then(function() {
        $('#roofId').attr("value", roofId);
      });
    });
  });

  // POST roof-type
  $('#flatRoof').click(function() {
    $.post('/roofs/' + roofId + '/angle', { angle: 0 });
  });

  // POST roof-angle
  $('#toPageEight').click(function() {
    angle = document.getElementById('dataContainerOrientation').innerHTML.slice(0, 2);
    $.post('/roofs/' + roofId + '/angle', { angle: angle });
  });

  // POST material
  $('#toPageTen').click(function() {
    $.post('/roofs/' + roofId + '/material', { material: material });
  });

  // POST shading
  $('#toPageEleven').click(function() {
    var shade_value = document.getElementById('shade').innerHTML;
    $.post('/roofs/' + roofId + '/shading', { shade_value: shade_value });
  });

  // POST measurements
  $('#btn-gutter').click(function() {
    var angled = $('#angled').val().slice(0, -1);
    var gutter = $('#gutter').val().slice(0, -1);
    $.post('/roofs/' + roofId + '/measurements', { angled_edge: angled, gutter_edge: gutter })
      .then(function(data) {
        roof = $.parseJSON(data);
        document.getElementById('panelCapacity').innerHTML = roof.panel_capacity;
        document.getElementById('powerCapacity').innerHTML = roof.power_capacity;
        document.getElementById('roofMaterial').innerHTML = roof.material;
        document.getElementById('roofShade').innerHTML = roof.shade_value;
        document.getElementById('roofAngle').innerHTML = roof.angle;
      });
  });

  // POST results
  $('#user_data').submit(function(event) {
    event.preventDefault();
    var title = $(this).find("input[name='title']").val();
    var discoveredBy = $(this).find("input[name='discovered_by']").val();
    var userEmail = $(this).find("input[name='user_email']").val();
    $.post('/roofs/' + roofId + '/capacity', { title: title, discovered_by: discoveredBy, user_email: userEmail })
  })

});