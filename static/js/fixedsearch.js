// static/scripts/fixedsearch/fixedsearch.js
/*--------------------------------------------------------------
fixedsearch — Super fast, client side search for Hugo.io with Fusejs.io
based on https://gist.github.com/cmod/5410eae147e4318164258742dd053993
--------------------------------------------------------------*/

if (typeof variable !== "undefined") {
    console.log("fixedsearch.js already loaded");
} else {
    fixedsearch = (function() {
        var search_form = document.getElementById("search-form"); // search form
        var search_input = document.getElementById("search-input"); // input box for search
        var search_submit = document.getElementById("search-submit"); // form submit button
        var search_results = document.getElementById("search-results"); // targets the <ul>
        var fuse; // holds our search engine
        var search__focus = false; // check to true to make visible by default
        var results_available = false; // did we get any search results?
        var first_run = true; // allow us to delay loading json data unless search activated
        var first = search_results.firstChild; // first child of search list
        var last = search_results.lastChild; // last child of search list

        search_form.classList.remove("noscript"); // JavaScript is active
        search_form.setAttribute("data-focus", search__focus);

        /*--------------------------------------------------------------
        The main keyboard event listener running the show
        --------------------------------------------------------------*/
        document.addEventListener("keydown", function(e) {
            // console.log(event); // DEBUG
            // Ctrl + / to show or hide Search
            // if (event.metaKey && event.which === 191) {

            if (document.activeElement.isContentEditable) {
                return false;
            }
            if (document.activeElement.tagName == "INPUT") {
                return false;
            }
            if (e.altKey || e.ctrlKey || e.shiftKey) {
                return false;
            }
            var key = e.key;
            if (key === "f") {
                e.preventDefault();
                e.stopPropagation();
                search_toggle_focus(e); // toggle visibility of search box
            }
        });

        /*--------------------------------------------------------------
        The main keyboard event listener running the show
        --------------------------------------------------------------*/
        search_form.addEventListener("keydown", function(e) {
            // Allow ESC (27) to close search box
            if (e.keyCode == 27) {
                search__focus = true; // make sure toggle removes focus
                search_toggle_focus(e);
            }

            // DOWN (40) arrow
            if (e.keyCode == 40) {
                if (results_available) {
                    e.preventDefault(); // stop window from scrolling
                    if (document.activeElement == search_input) {
                        first.focus();
                    } // if the currently focused element is the main input --> focus the first <li>
                    else if (document.activeElement == last) {
                        first.focus();
                    } // if we're at the bottom, loop to the start
                    // else if ( document.activeElement == last ) { last.focus(); } // if we're at the bottom, stay there
                    else {
                        document.activeElement.parentElement.nextSibling.firstElementChild.focus();
                    } // otherwise select the next search result
                }
            }

            // UP (38) arrow
            if (e.keyCode == 38) {
                if (results_available) {
                    e.preventDefault(); // stop window from scrolling
                    if (document.activeElement == search_input) {
                        search_input.focus();
                    } // If we're in the input box, do nothing
                    else if (document.activeElement == first) {
                        search_input.focus();
                    } // If we're at the first item, go to input box
                    else {
                        document.activeElement.parentElement.previousSibling.firstElementChild.focus();
                    } // Otherwise, select the search result above the current active one
                }
            }

            // Use Enter (13) to move to the first result
            if (e.keyCode == 13) {
                if (results_available && document.activeElement == search_input) {
                    e.preventDefault(); // stop form from being submitted
                    first.focus();
                }
            }

            // Use Backspace (8) to switch back to the search input
            if (e.keyCode == 8) {
                if (document.activeElement != search_input) {
                    e.preventDefault(); // stop browser from going back in history
                    search_input.focus();
                }
            }
        });

        /*--------------------------------------------------------------
        Load our json data and builds fuse.js search index
        --------------------------------------------------------------*/
        search_form.addEventListener("focusin", function(e) {
            search_init(); // try to load the search index
        });

        /*--------------------------------------------------------------
        Make submit button toggle focus
        --------------------------------------------------------------*/
        search_form.addEventListener("submit", function(e) {
            search_toggle_focus(e);
            e.preventDefault();
            return false;
        });

        /*--------------------------------------------------------------
        Remove focus on blur
        --------------------------------------------------------------*/
        search_form.addEventListener("focusout", function(e) {
            if (e.relatedTarget === null) {
                search_toggle_focus(e);
            } else if (e.relatedTarget.type === "submit") {
                e.stopPropagation();
            }
        });

        /*--------------------------------------------------------------
        Toggle focus UI of form
        --------------------------------------------------------------*/
        function search_toggle_focus(e) {
            // console.log(e); // DEBUG
            // order of operations is very important to keep focus where it should stay
            if (!search__focus) {
                search_submit.value = "⨯";
                search_form.setAttribute("data-focus", true);
                search_input.focus(); // move focus to search box
                search__focus = true;
            } else {
                search_submit.value = "search";
                search_form.setAttribute("data-focus", false);
                document.activeElement.blur(); // remove focus from search box
                search__focus = false;
            }
        }

        /*--------------------------------------------------------------
        Fetch some json without jquery
        --------------------------------------------------------------*/
        function fetch_JSON(path, callback) {
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === 4) {
                    if (httpRequest.status === 200) {
                        var data = JSON.parse(httpRequest.responseText);
                        if (callback) callback(data);
                    }
                }
            };
            httpRequest.open("GET", path);
            httpRequest.send();
        }

        /*--------------------------------------------------------------
        Load script
        based on https://stackoverflow.com/a/55451823
        --------------------------------------------------------------*/
        function load_script(url) {
            return new Promise(function(resolve, reject) {
                let script = document.createElement("script");
                script.onerror = reject;
                script.onload = resolve;
                if (document.currentScript) {
                    document.currentScript.parentNode.insertBefore(
                        script,
                        document.currentScript
                    );
                } else {
                    document.head.appendChild(script);
                }
                script.src = url;
            });
        }

        /*--------------------------------------------------------------
        Load our search index, only executed once
        on first call of search box (Ctrl + /)
        --------------------------------------------------------------*/
        function search_init() {
            if (first_run) {
                load_script(window.location.origin + "/js/fuse.js")
                    .then(() => {
                        search_input.value = ""; // reset default value
                        first_run = false; // let's never do this again
                        fetch_JSON(
                            search_form.getAttribute("data-language-prefix") + "/index.json",
                            function(data) {
                                var options = {
                                    // fuse.js options; check fuse.js website for details
                                    shouldSort: true,
                                    location: 0,
                                    distance: 100,
                                    threshold: 0.4,
                                    minMatchCharLength: 2,
                                    keys: [
                                        "permalink",
                                        "title",
                                        "date",
                                        "summary",
                                        "section",
                                        "categories",
                                        "tags",
                                    ],
                                };

                                fuse = new Fuse(data, options); // build the index from the json file

                                search_input.addEventListener("keyup", function(e) {
                                    // execute search as each character is typed
                                    search_exec(this.value);
                                });
                                // console.log("index.json loaded"); // DEBUG
                            }
                        );
                    })
                    .catch((error) => {
                        console.log("fixedsearch failed to load: " + error);
                    });
            }
        }

        /*--------------------------------------------------------------
        Using the index we loaded on Ctrl + /, run
        a search query (for "term") every time a letter is typed
        in the search box
        --------------------------------------------------------------*/
        function search_exec(term) {
            let results = fuse.search(term); // the actual query being run using fuse.js
            let search_items = ""; // our results bucket

            if (results.length === 0) {
                // no results based on what was typed into the input box
                results_available = false;
                search_items = "";
            } else {
                // build our html
                for (let item in results.slice(0, 5)) {
                    // only show first 5 results
                    search_items =
                        search_items +
                        `<li><a href="${results[item].item.permalink}" tabindex="0">
	<span class="title">${results[item].item.title}</span>
	<span class="date">${results[item].item.date}</span>
	<span class="summary">${results[item].item.summary}</span>
	<span class="section">${results[item].item.section}</span>
	<span class="categories">${results[item].item.categories.join(", ")}</span>
	<span class="tags">${results[item].item.tags.join(", ")}</span>
</a></li>`;
                }
                results_available = true;
            }

            search_results.innerHTML = search_items;
            if (results.length > 0) {
                first = search_results.firstChild.firstElementChild; // first result container — used for checking against keyboard up/down location
                last = search_results.lastChild.firstElementChild; // last result container — used for checking against keyboard up/down location
            }
        }
    })();
}
