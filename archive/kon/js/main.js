"use strict";

var $targetSection = null;

$(window).scroll(function ()
{
	var $headerHolder = $(".header-holder");

	if ($(window).scrollTop() > 1)
	{
		$headerHolder.addClass("sticky");
	}
	else
	{
		$headerHolder.removeClass("sticky");
	}
});

$(document).ready(function ()
{
	$(".navbar-toggle").click(function ()
	{
		$(".logo").toggleClass("expand");
		$(".top-navigation").toggleClass("expand");
	});

	$(".page-navigation__about-us a").click(function ()
	{
		var $target = $("#st-" + $(this).attr("data-target"));
		scrollTo($target);
	});

	/* -- [how we work] -- */
	if ($(".container__how-we-work").length > 0)
	{
		$(window).bind('scroll', function (e)
		{
			dotnavigation();
		});

		function dotnavigation()
		{
			var numSections = $('section').length;

			$('#dot-nav li a').removeClass('active').parent('li').removeClass('active');
			$('section').each(function (i, item)
			{
				var ele = $(item), nextTop, thisTop;
				if (typeof ele.next().offset() != "undefined")
				{
					nextTop = ele.next().offset().top;
				}
				else
				{
					nextTop = $(document).height();
				}

				if (ele.offset() !== null)
				{
					thisTop = ele.offset().top - ((nextTop - ele.offset().top) / numSections);
				}
				else
				{
					thisTop = 0;
				}

				var docTop = $(document).scrollTop();

				if (docTop >= thisTop && (docTop < nextTop))
				{
					$('#dot-nav li').eq(i).addClass('active');
				}
			});
		}

		/* get clicks working */
		$('#dot-nav li').click(function ()
		{
			var id = $(this).find('a').attr("href"), posi, ele, padding = 0;

			ele = $(id);
			posi = ($(ele).offset() || 0).top - padding - 90;

			$('html, body').animate({ scrollTop: posi }, 'slow');

			return false;
		});
	}
	/* -- [/how we work] -- */

	/* -- [press - swiper] -- */
	if ($(".header__press").length > 0)
	{
		if ($(window).width() < 768)
		{
			var swiper = new Swiper('.swiper-container',
			{
				pagination: '.swiper-pagination',
				paginationClickable: true
			});
		}
	}
	/* -- [/press - swiper] -- */
});

function scrollTo($target)
{
	if ($target != null)
	{
		console.info("scrolling", $target);


		var headerHeight = 145;
		window.setTimeout(function ()
		{
			var position = $target.offset().top;
			$('html, body').delay(100).animate(
			{
				scrollTop: (parseInt(position) - headerHeight)
			}, 500, "swing");
		}, 150);
	}
}