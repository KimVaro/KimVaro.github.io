var paging = function () {

    //called: resultsFiltering.pagination(10);
    var pagination = function (numberPerPage, parentContainer) {

        //Pagination extension
        (function () {

            ko.extenders.paging = function (target, pageSize) {

                if (numberPerPage) {
                    var pageSize = numberPerPage;
                }

                // Page size - defaults to 10
                var _pageSize = ko.observable(pageSize || 10),

                    // Current page - defaults to 1
                    _currentPage = ko.observable(1),

                    _totalCount = function(targetObject) {
                        return typeof (targetObject) == 'number'
                            ? targetObject
                            : targetObject.length;
                    };

                // Store page size as a computed variable
                target.pageSize = ko.computed({
                    read: _pageSize,
                    write: function (newValue) {
                        if (newValue > 0) {
                            _pageSize(newValue);
                        }
                        else {
                            _pageSize(10);
                        }
                        _currentPage(1);
                    }
                });

                // Store current page as a computed variable
                target.currentPage = ko.computed({
                    read: _currentPage,
                    write: function (newValue) {
                        if (newValue > target.pageCount()) {
                            _currentPage(target.pageCount());
                        }
                        else if (newValue <= 0) {
                            _currentPage(1);
                        }
                        else {
                            _currentPage(newValue);
                        }
                    }
                });

                // Store two pages backwards as a computed variable
                target.currentPageMinusTwo = ko.computed(function () {
                    return target.currentPage() - 2;
                });

                // Store one page backwards as a computed variable
                target.currentPageMinusOne = ko.computed(function () {
                    return target.currentPage() - 1;
                });

                // Store one page forward as a computed variable
                target.currentPagePlusOne = ko.computed(function () {
                    return target.currentPage() + 1;
                });

                // Store two pages forward as a computed variable
                target.currentPagePlusTwo = ko.computed(function () {
                    return target.currentPage() + 2;
                });

                // Calculate total page count
                target.pageCount = ko.computed(function () {
                    return Math.ceil(_totalCount(target()) / target.pageSize()) || 1;
                });

                // Store data about current page
                target.currentPageData = ko.computed(function () {
                    var pageSize = _pageSize(),
                        pageNumber = _currentPage(),
                        startIndex = pageSize * (pageNumber - 1),
                        endIndex = pageSize * pageNumber;
                    var currentPageData;
                    if (typeof (target()) == 'number') {
                        currentPageData = pageSize;
                    } else {
                        currentPageData = target().slice(startIndex, endIndex);
                    }
                    return currentPageData;
                });

                // Store first visible item value as computed variable
                target.pageStart = ko.computed(function () {

                    var pageSize = _pageSize(),
                        pageNumber = _currentPage();

                    return pageSize * (pageNumber - 1) + 1;

                });

                // Store last visible item value as computed variable
                target.pageEnd = ko.computed(function () {

                    var pageSize = _pageSize(),
                        pageNumber = _currentPage(),
                        totalLength = _totalCount(target()),
                        pageCount = target.pageCount(),
                        isLastPage = pageNumber == pageCount;

                    if (isLastPage && totalLength == (pageCount * pageSize)) {
                        return (pageSize * pageNumber + (totalLength % pageSize));
                    }
                    else if (isLastPage) {
                        return (pageSize * (pageNumber - 1) + (totalLength % pageSize));
                    } else {
                        return pageSize * pageNumber;
                    }
                });

                // Decide whether to show previous item button
                target.minusOneTrue = ko.computed(function () {

                    if (target.currentPage() > 1) {
                        return true;
                    } else {
                        return false;
                    }

                });

                // Decide whether to show previous item (2) button
                target.minusTwoTrue = ko.computed(function () {

                    if (target.currentPage() > 2) {
                        return true;
                    } else {
                        return false;
                    }

                });

                // Decide whether to show next item button
                target.plusOneTrue = ko.computed(function () {
                    if (target.currentPage() == target.pageCount()) {
                        return false;
                    } else {
                        return true;
                    }
                });

                // Decide whether to show next item (+2) button
                target.plusTwoTrue = ko.computed(function () {
                    if (target.currentPage() >= target.pageCount() - 1) {
                        return false;
                    } else {
                        return true;
                    }
                });

                // Next page function
                var nextPage = function () {
                    target.currentPage(target.currentPage() + 1);
                    scrollTop();
                };

                // Previous page function
                var prevPage = function () {
                    target.currentPage(target.currentPage() - 1);
                    scrollTop();
                };

                // Scroll to top of page function
                var scrollTop = function () {
                    jQuery(window).scrollTop(parentContainer.offset().top);
                };

                // Move to first page
                target.moveFirst = function () {
                    target.currentPage(1);
                    scrollTop();
                };

                // Move to previous page
                target.movePrevious = function () {
                    prevPage();
                };

                // Skip back two pages
                target.minusTwo = function () {
                    target.currentPage(target.currentPage() - 2);
                    scrollTop();
                };

                // Skip back one page
                target.minusOne = function () {
                    prevPage();
                };

                // Move to next page
                target.moveNext = function () {
                    nextPage();
                };

                // Skip forward one page
                target.plusOne = function () {
                    nextPage();
                };

                // Skip forward two pages
                target.plusTwo = function () {
                    target.currentPage(target.currentPage() + 2);
                    scrollTop();
                };

                // Move to last page
                target.moveLast = function () {
                    target.currentPage(target.pageCount());
                    scrollTop();
                };

                // Change current page to 1 after selecting a filter
                jQuery('.filterContainer').on('click', 'input', function () {
                    target.currentPage(1);
                });

                // Change current page to 1 after changing sort order
                jQuery('#SortVehicleOptions').on('change', function () {
                    target.currentPage(1);
                });

                return target;
            };
        }());
    };

    return {

        pagination: pagination
    }

}();