'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var exports = {},
      days = [{
        hotels:      [],
        restaurants: [],
        activities:  []
      }],
      currentDay = days[0];


  function addDay () {
      days.push({
      hotels: [],
      restaurants: [],
      activities: []
    });
    postday();
    renderDayButtons();
    switchDay(days.length - 1);
  }

  function switchDay (index) {
    var $title = $('#day-title');
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index + 1) + '</span>');
    currentDay = days[index];
    renderDay();
    renderDayButtons();
  }

  function removeCurrentDay () {
    if (days.length === 1) return;
    var index = days.indexOf(currentDay);
    days.splice(index, 1);
    switchDay(index);
    console.log(index);
    deleteday(index);
  }

  function renderDayButtons () {
    var $daySelect = $('#day-select');
    $daySelect.empty();
    days.forEach(function(day, i){
      $daySelect.append(daySelectHTML(day, i, day === currentDay));
    });
    $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML (day, i, isCurrentDay) {
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  exports.addAttraction = function(attraction) {
    if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
    currentDay[attraction.type].push(attraction);
    if (attraction.type === 'hotels') {
    $.post('/api/days/' + days.indexOf(currentDay) + '/hotel' + '', {hotelId:  attraction._id})
    }
    else if (attraction.type === 'restaurants') {
    $.post('/api/days/' + days.indexOf(currentDay) + '/restaurants' + '', {restaurantId:  attraction._id })
    }
    else if (attraction.type === 'activities') {
    $.post('/api/days/' + days.indexOf(currentDay) + '/activities' + '', {activitiesId:  attraction._id })
    }
    renderDay(currentDay);

  };

  exports.removeAttraction = function (attraction) {
    var index = currentDay[attraction.type].indexOf(attraction);
    if (index === -1) return;
    currentDay[attraction.type].splice(index, 1);
    renderDay(currentDay);
  };

  function renderDay(day) {
    mapModule.eraseMarkers();
    day = day || currentDay;
    Object.keys(day).forEach(function(type){
      var $list = $('#itinerary ul[data-type="' + type + '"]');
      $list.empty();
      day[type].forEach(function(attraction){
        $list.append(itineraryHTML(attraction));
        mapModule.drawAttraction(attraction);
      });
    });
  }

  function itineraryHTML (attraction) {
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + attraction.type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  var getdays = function () { 
    $.get('/api/days', function (data) {
      console.log(data)
      data.forEach( function(day) {
        days.push(day)
      })
      renderDayButtons();
    })
    .fail( function (err) {
      console.error('err', err)
    });
  }

  var postday = function () {
    $.post('/api/days')
    .done(function( data ) {
    console.log( data );
  });
  }

  var deleteday = function (id) {
    $.ajax({
    url: '/api/days/' + id + '',
    type: 'DELETE',
    success: function(result) {
        console.log("Success!" + result)
    }
    });
  }

getdays();
// if(days.length === 1) postday();

  $(document).ready(function(){
    switchDay(0);
    $('.day-buttons').on('click', '.new-day-btn', addDay);
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
  });

  return exports;

}());
