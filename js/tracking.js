(function(){
  ga = window.ga || {};
  var gaOptions = {
    'slateZip' : {
      hitType: 'event',
      eventCategory: 'Zip',
      eventAction: 'download',
      eventLabel: 'Slate zip file'
    }
  }

  function handleTrackedClicks(evt) {
    var el = evt.target;
    var gaTrack = el.dataset['gaTrack'];
    ga('send', gaOptions[gaTrack]);
  };

  var trackedElements = document.querySelectorAll('[data-ga-track]');
  var trackedArr = Array.from(trackedElements);

  trackedArr.forEach(function(element){
    element.addEventListener('click', handleTrackedClicks);
  });
})();
