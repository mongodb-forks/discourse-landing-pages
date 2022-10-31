(function ($) {
  let $forms = $(".contact-form, .subscription-form");

  if ($forms && $forms.length) {
    $forms.each(function () {
      let $form = $(this);
      let $submit = $(this).find(".btn-primary");

      $form.find("input, textarea").on("keydown", function (e) {
        if (e.keyCode === 13 && e.shiftKey) {
          $form.submit();
        }
      });

      $form.submit(function () {
        $form.addClass("submitting");
        $submit.attr("disabled", true);

        $.ajax({
          type: "POST",
          url: $(this).attr("action"),
          data: $(this).serialize(),
          dataType: "JSON",
        }).always(function (result) {
          if (result && result.status === 200) {
            $form.addClass("success");
          } else {
            $form.addClass("error");
          }
          $form.removeClass("submitting");
          $form.addClass("submitted");

          $form.find("input[type=text], textarea").val("");
          $submit.attr("disabled", false);

          setTimeout(function () {
            $form.removeClass("submitted");
            $form.removeClass("success");
            $form.removeClass("error");
          }, 10000);
        });

        return false;
      });
    });
  }

  let $window = $(window);
  let $body = $("body");
  let $topicLists = $('.topic-list[data-scrolling-topic-list="true"]');

  function loadTopics($topicList) {
    let topicListBottom =
      $topicList.offset().top + $topicList.outerHeight(true);
    let windowBottom = $window.scrollTop() + $window.height();
    let reachedBottom = topicListBottom <= windowBottom - 50;
    let loading = $topicList.hasClass("loading");
    let listEnd = $topicList.data("list-end");

    if (reachedBottom && !loading && !listEnd) {
      const count = $topicList.children().length;
      const perPage = Number($topicList.data("list-per-page"));
      const currentTopicIds = $topicList
        .find(".topic-list-item")
        .map(function () {
          return Number($(this).data("topic-id"));
        })
        .get();
      const page = Number($topicList.data("list-page"));

      const data = {
        page_id: $topicList.data("page-id"),
        list_opts: {
          category: $topicList.data("list-category"),
          tags: $topicList.data("list-tags"),
          except_topic_ids: currentTopicIds,
          page,
          per_page: perPage,
          no_definitions: $topicList.data("list-no-definitions"),
        },
        item_opts: {
          classes: $topicList.data("item-classes"),
          excerpt_length: $topicList.data("item-excerpt-length"),
          include_avatar: $topicList.data("item-include-avatar"),
          profile_details: $topicList.data("item-profile-details"),
          avatar_size: $topicList.data("item-avatar-size"),
        },
      };

      if (count === perPage * (page + 1)) {
        $topicList.addClass("loading");

        $.ajax({
          type: "GET",
          url: "/landing/topic-list",
          data,
          success: function (result) {
            $topicList.append(result.topics_html);
            let newCount = $topicList.children().length;

            if (newCount === count) {
              $topicList.attr("data-list-end", true);
            } else {
              let newPage = page + 1;
              $topicList.attr("data-page", newPage);

              if (newCount < perPage * (newPage + 1)) {
                $topicList.attr("data-list-end", true);
              }
            }
          },
        }).always(function () {
          $topicList.removeClass("loading");
        });
      } else {
        $topicList.attr("data-list-end", true);
      }
    }
  }

  if ($window) {
    $window.on("scroll", function () {
      $body.toggleClass("scrolled", $window.scrollTop() > 0);

      if ($topicLists.length) {
        $topicLists.each(function () {
          loadTopics($(this));
        });
      }
    });
  }
})(jQuery); // eslint-disable-line
