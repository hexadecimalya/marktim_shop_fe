
export default defineNuxtPlugin((nuxtApp) => {

  return {
    provide: {
      loadGoogleMaps: () => {
        return new Promise((resolve, reject) => {
          if (window.google && window.google.maps) {
            resolve(window.google.maps);
            return;
          }

          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAKVNCN47rAGi51H0GcwZ-VfKmLqecrT5s&libraries=maps,marker&v=beta&callback=initMap`;
          script.async = true;
          script.onerror = reject;
          document.head.appendChild(script);

          window.initMap = () => {
            resolve(window.google.maps);
          };
        });
      }
    }
  };
});