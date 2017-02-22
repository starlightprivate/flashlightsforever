function validate() {
  'use strict';
  // Look for ios devices and safari
  if (isMobileSafari()) {
    // Search for credit card input and change it to text field
    if ($('input#creditcard').length > 0) {
      $('input#creditcard').attr('type', 'text');
    }
  }
  if (!customWrapperForIsMobileDevice()) {
    $('input[type=number]').attr('type', 'text');
  }
   var array = [];
   var stringnumb = '';
  $('#creditcard').keyup(function(event) {
    if((parseInt(event.originalEvent.key) <= 9 && parseInt(event.originalEvent.key) >= 0) || event.originalEvent.key == 'Backspace'){
      if(event.originalEvent.key == 'Backspace'){
        array.splice(array.length-1,1);
        stringnumb = stringnumb.slice(0,array.length-1);
      }else{
        array.push(event.originalEvent.key);
        stringnumb = stringnumb + event.originalEvent.key;
      }
        if(array.length >= 2){
          if(array[0] == 3){
            if(array[1] == 4 || array[1] == 7){
              $('.payment-icon .cc-american-express').addClass('active');
              $('.payment-icon .cc-visa').addClass('faded');
              $('.payment-icon .cc-mastercard').addClass('faded');
              $('.payment-icon .cc-discover').addClass('faded');
            }
          }else if(array[0] == 4){
            $('.payment-icon .cc-visa').addClass('active');
            $('.payment-icon .cc-american-express').addClass('faded');
            $('.payment-icon .cc-mastercard').addClass('faded');
            $('.payment-icon .cc-discover').addClass('faded');
          }else if(array[0] == 2){
            if(array[1] < 8 && array[1] > 1){
              $('.payment-icon .cc-mastercard').addClass('active');
              $('.payment-icon .cc-visa').addClass('faded');
              $('.payment-icon .cc-discover').addClass('faded');
              $('.payment-icon .cc-american-express').addClass('faded');
            }
          }else if(array[0] == 5){
            if(array[1] < 6 && array[1] > 0){
              $('.payment-icon .cc-mastercard').addClass('active');
              $('.payment-icon .cc-visa').addClass('faded');
              $('.payment-icon .cc-discover').addClass('faded');
              $('.payment-icon .cc-american-express').addClass('faded');
            }
          }
        }
        if(stringnumb.length == 6){
          var numb = parseInt(stringnumb);
          if((numb >= 601100 && numb <= 601109) || (numb >= 601120 && numb <= 601149) || (numb >= 601177 && numb <= 601179) || (numb >= 601186 && numb <= 601199) || (numb >= 644000 && numb <= 659999) || numb == 601174){
            
            $('.payment-icon .cc-discover').addClass('active');
            $('.payment-icon .cc-visa').addClass('faded');
            $('.payment-icon .cc-mastercard').addClass('faded');
            $('.payment-icon .cc-american-express').addClass('faded');
          }
        }
        if($( this ).val() === ''){
          array = [];
          $('.payment-icon .cc-icon').removeClass('inactive active faded');
        }
    }
  });
  $('#creditcard').blur(function(event){
    console.log("active");
    var numbstr = event.target.value.replace(/\s/g,'');
    var stcase = numbstr.slice(0,2);
    stcase = parseInt(stcase);
    var ndcase = numbstr.slice(0,5);
    ndcase = parseInt(ndcase);
    if(stcase == 34 || stcase == 37){
      $('.payment-icon .cc-american-express').addClass('active');
      $('.payment-icon .cc-visa').addClass('faded');
      $('.payment-icon .cc-mastercard').addClass('faded');
      $('.payment-icon .cc-discover').addClass('faded');
    }else if (stcase >= 40 && stcase <= 49){
      $('.payment-icon .cc-visa').addClass('active');
      $('.payment-icon .cc-american-express').addClass('faded');
      $('.payment-icon .cc-mastercard').addClass('faded');
      $('.payment-icon .cc-discover').addClass('faded');
    }else if((stcase > 21 && stcase < 28) || (stcase > 50 && stcase < 56)){
      $('.payment-icon .cc-mastercard').addClass('active');
      $('.payment-icon .cc-visa').addClass('faded');
      $('.payment-icon .cc-discover').addClass('faded');
      $('.payment-icon .cc-american-express').addClass('faded');      
    }else if((ndcase >= 601100 && ndcase <= 601109) || (ndcase >= 601120 && ndcase <= 601149) || (ndcase >= 601177 && ndcase <= 601179) || (ndcase >= 601186 && ndcase <= 601199) || (ndcase >= 644000 && ndcase <= 659999) || ndcase == 601174){
      $('.payment-icon .cc-discover').addClass('active');
      $('.payment-icon .cc-visa').addClass('faded');
      $('.payment-icon .cc-mastercard').addClass('faded');
      $('.payment-icon .cc-american-express').addClass('faded');
    } 
  });

  // Mailcheck Plugin Code here
  if ($('#email').length > 0) {
    var domains = ['hotmail.com', 'gmail.com', 'aol.com'];
    var topLevelDomains = ["com", "net", "org"];
    $('#email').on('blur', function (event) {
      // console.log("event ", event);
      // console.log("this ", $(this));
      $(this).mailcheck({
        domains: domains,
        topLevelDomains: topLevelDomains,
        suggested: function (element, suggestion) {
          // console.log("suggestion ", suggestion.full);
          $('#email + small').show();
          $('#email + small').html('Did you mean <a href=\'javascript:void(0)\'>' + suggestion.full + '</a>');
        },
        empty: function (element) {
          // console.log("suggestion ", "No suggestion");
        }
      });
    });
    // If user click on the suggested email, it will replace that email with suggested one.
    $('body').on('click', '#email + small a', function () {
      $('#email').val($(this).html());
      $('#email + small').hide();
      $('#email + small').html('Great! We will send you a confirmation e-mail with tracking # after purchasing.');
      if ($('form').length > 0) {
        $('form').formValidation('revalidateField', 'email');
      }
    });
  }
}
validate();