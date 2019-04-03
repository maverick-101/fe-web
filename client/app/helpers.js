import React from 'react';
import sanitizeHtml from 'sanitize-html';


// var currencyRates = {
//   AED : 10,
//   AUD : 30,
//   CAS : 40,
//   USD : 102,
//   EUR : 100,
//   CNY : 9,
//   GBP : 18,
// }

export function sanitize(html) {
  return sanitizeHtml(html, {allowedTags: ['p', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'strong']});
}

export function stripHTML(html) {
  if(html) {
    return sanitizeHtml(html, {allowedTags: []});
  } else {
    return ''
  }
}

export function convertPrice(price, currency = 'PKR', currencyRates) {
  if(currency == 'PKR') {
    if(price >= 10000000) {
      // return `${Math.round(price/10000000*100)/100}${price == 20000000 ? '+' : ''} crore`;
      return ` ${Math.round(price/10000000*100)/100} crore `;
    }
    if(price >= 100000) {
      // return `${Math.round(price/100000*100)/100}${price == 300000 ? '+' : ''} lac`;
      return ` ${Math.round(price/100000*100)/100} lac `;
    }
    if(price >= 1000) {
      // return ` ${Math.round(price/1000*100)/100} Thousand `;
      // return 
      var parsedPrice = price.toString().split('');
      parsedPrice.splice((parsedPrice.length-3), 0, ',');
      return parsedPrice.join('');
    }
    return price;
  }
  else {
     var curr = currencyRates && currency ? ((Math.round(price * parseFloat(currencyRates[currency]) / 1000)*1000) > 1000 
     ? (Math.round(price * parseFloat(currencyRates[currency]) / 1000)*1000).toLocaleString() 
     : (Math.round(price * parseFloat(currencyRates[currency])) ) ) : 0
     return curr;
  }
}

export function convertUnit(unit) {
  var size = {
    standard: 'Standard',
    kanal: 'Kanal',
    marla: 'Marla',
    sqft: <span>SqFt</span>,
    sqyd: <span>SqYd</span>,
    sqm: <span>M<sup>2</sup></span>,
  }
  return size[unit];
}

function convertToCSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
          if (line != '') line += ','

          line += array[i][index];
      }

      str += line + '\r\n';
  }

  return str;
}

export function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

export function convertSize(size, unit, marla_size = 250) {
  switch(unit) {
    case 'sqm':
      return (size / 10.7639).toFixed(2);
    case 'sqyd':
      return (size / 9).toFixed(2);
    case 'kanal':
      return (size / (20 * marla_size)).toFixed(2);
    case 'marla':
      return (size / marla_size).toFixed(2);
    default:
      return size;
  }
}

export function checkForHttps(url) {
  var a = url ? url.split('https') : '';
  if (url && a[0] == url) {
    var b = a[0].split('http');
    var c = 'https' + b[1];
    return c;
  } else {
    return url;
  }
}

export function imgUpload(url, type, watermark = true) {
  if (type == 'h_500') {
    var a = url ? url.split('res.cloudinary.com') : '';
    if (a[0] != url) {
      var a = url.split('/upload');
      if (watermark) {
      var b = a[0] + '/upload/h_500,q_auto,f_auto' + a[1];
      }
      else {
        var b = a[0] + '/upload/h_500,q_auto,f_auto' + a[1];
      }
      return checkForHttps(b);
    } else {
      return checkForHttps(url);;
    }
  }
  if (type == 'h_100') {
    var a = url ? url.split('res.cloudinary.com') : '';
    if (a[0] != url) {
      var a = url.split('/upload');
      if (watermark) {
        var b = a[0] + '/upload/h_100,q_auto,f_auto' + a[1];
        }
      else {
        var b = a[0] + '/upload/h_100,q_auto,f_auto' + a[1];
      }
      
      return checkForHttps(b);
    } else {
      return checkForHttps(url);;
    }
  }
  if (type == 'h_250') {
    var a = url ? url.split('res.cloudinary.com') : ''
    if (a[0] != url) {
      var a = url.split('/upload');
      if (watermark) {
        var b = a[0] + '/upload/h_250,q_auto,f_auto' + a[1];
        }
      else {
        var b = a[0] + '/upload/h_250,q_auto,f_auto' + a[1];
      }
      // var b = a[0] + '/upload/h_250,q_95' + a[1];
      return checkForHttps(b);
    } else {
      return checkForHttps(url);;
    }
  }
  if (type == 'h_750') {
    var a = url ? url.split('res.cloudinary.com') : ''
    if (a[0] != url) {
      var a = url.split('/upload');
      if (watermark) {
        var b = a[0] + '/upload/h_750,q_auto,f_auto' + a[1];
        }
      else {
        var b = a[0] + '/upload/h_750,q_auto,f_auto' + a[1];
      }
      // var b = a[0] + '/upload/h_750,q_95' + a[1];
      return checkForHttps(b);
    } else {
      return checkForHttps(url);;
    }
  }
  if (type == 'h_400') {
    var a = url ? url.split('res.cloudinary.com') : ''
    if (a[0] != url) {
      var a = url.split('/upload');
      if (watermark) {
        var b = a[0] + '/upload/h_400,q_auto,f_auto' + a[1];
        }
      else {
        var b = a[0] + '/upload/h_400,q_auto,f_auto' + a[1];
      }
      // var b = a[0] + '/upload/h_400,q_95' + a[1];
      return checkForHttps(b);
    } else {
      return checkForHttps(url);;
    }
  }
  if (type == 'h_600') {
    var a = url ? url.split('res.cloudinary.com') : ''
    if (a[0] != url) {
      var a = url.split('/upload');
      if (watermark) {
        var b = a[0] + '/upload/h_600,q_auto,f_auto' + a[1];
        }
      else {
        var b = a[0] + '/upload/h_600,q_auto,f_auto' + a[1];
      }
      // var b = a[0] + '/upload/h_600,q_95' + a[1];
      return checkForHttps(b);
    } else {
      return checkForHttps(url);;
    }
  }
  if (type == 'h_1000') {
    var a = url ? url.split('res.cloudinary.com') : ''
    if (a[0] != url) {
      var a = url.split('/upload');
      if (watermark) {
        var b = a[0] + '/upload/h_2000,q_auto,f_auto' + a[1];
        }
      else {
        var b = a[0] + '/upload/h_2000,q_auto,f_auto' + a[1];
      }
      // var b = a[0] + '/upload/h_600,q_95' + a[1];
      return checkForHttps(b);
    } else {
      return checkForHttps(url);;
    }
  }
}

export const _amenities =  {
    'free_breakfast': {
      image: 'http://www.restaurantnews.com/wp-content/uploads/2017/11/Friendlys-Celebrates-Veterans-Day-with-Free-Breakfast-Lunch-or-Dinner-for-Veterans-and-Active-Military.jpg',
    },
    'free_wifi': {
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/WiFi_Logo.svg/1200px-WiFi_Logo.svg.png',
    },
    'hospitals': {
      image: 'https://res.cloudinary.com/graanacom/image/upload/v1530859564/hospital.jpg',
    },
    'mosque': {
      image: 'https://res.cloudinary.com/graanacom/image/upload/v1530859565/mosque.jpg',
    },
    'park_and_playground_/_recreation': {
      image: 'https://res.cloudinary.com/graanacom/image/upload/v1530859565/park_playground.jpg',
    },
    'gymnasium': {
      image: 'https://res.cloudinary.com/graanacom/image/upload/v1530859564/gymnasium.jpg',
    },
    'shopping_mall' : {
      image: 'https://res.cloudinary.com/graanacom/image/upload/v1530859565/shopping-mall.jpg',
    },
    'emergency_and_rescue': {
      image: 'https://res.cloudinary.com/graanacom/image/upload/v1530859565/emergency-rescue.jpg',
    },
    'nearby_public_transport_service': {
      image: 'https://res.cloudinary.com/graanacom/image/upload/v1530859565/transport-public.jpg',
    },
};

