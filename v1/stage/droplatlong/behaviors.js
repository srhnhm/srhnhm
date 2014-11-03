 $(document).ready(function() {
    
    // behaviors for controlling the menu
    $('div#change').on({
        click: function() {
            citylist.slideToggle(500)
        }
    });
    $('div#citylist').on({
        mouseleave: function() {
            citylist.slideToggle(500)
        }
    });

    $('#about').on({
        click: function(){
            $('div#aboutPopup').slideToggle(300);
            // $('div#aboutPopup > div').css('opacity', 1)
        }
    });

    $('#aboutPopup').on({
        mouseleave: function(){
            $(this).slideToggle(300)
        }
    });
    
    $('div.fb').on({
        mouseenter: function() {
            $(this).find('.mask').css('display', 'none');
            $(this).find('.likebutton').css('display', 'block');
        },
        mouseleave: function() {
            $(this).find('.mask').css('display', 'block');
            $(this).find('.likebutton').css('display', 'none');
        }
    });
    
});