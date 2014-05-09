var utils = require('./helper/utils');
// Use the external Chai As Promised to deal with resolving promises in
// expectations.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

var select = function(arg1, arg2, index, callback) {
    return utils.findInput(arg2, index).then(function(select) {
        return select.findElement(by.xpath('//option[text()="' + arg1 + '"]'));
    }).then(function(option) {
        return option.click();
    }).then(callback);
};

var driver = browser.driver;

module.exports = function() {

    this.Given(/^I run Cucumber with Protractor$/, function(next) {
        next();
    });

    this.Given(/^I go on(?: the website)? "([^"]*)"$/, function(url, next) {
        browser.get(url);
        next();
    });

    this.Then(/^it should still do normal tests$/, function(next) {
        expect(true).to.equal(true);
        next();
    });

    this.Then(/^it should expose the correct global variables$/, function(next) {
        expect(protractor).to.exist;
        expect(browser).to.exist;
        expect(by).to.exist;
        expect(element).to.exist;
        expect($).to.exist;
        next();
    });

    this.Then(/the title should equal "([^"]*)"$/, function(text, next) {
        expect(browser.getTitle()).to.eventually.equal(text).and.notify(next);
    });

    /**
     * Switch to an iframe
     *
     * @param {string|number} name The iframes name or index
     */
    this.Given(/^I switch to "([^"]*)" iframe$/, function(arg1, callback) {
        driver.switchTo().frame(arg1).then(callback);
    });

    /**
     * Switch selenium context to last browser tab
     */
    this.Given(/^I switch to the last tab$/, function(callback) {
        driver.getAllWindowHandles().then(function(handles) {
            return driver.switchTo().window(handles[handles.length - 1]).then(function() {
                driver.executeScript('window.focus();');
            }).then(callback);
        });
    });

    this.Then(/^I should see the heading "([^"]*)"$/, function(arg1, callback) {
        driver.findElement(by.tagName('h1')).getText().then(function(text) {
            assert.equal(text, arg1);
            callback();
        });
    });

    this.Then(/^"([^"]*)" repeater length should be "([^"]*)"$/, function(arg1, arg2, callback) {
        browser.element.all(by.repeater(arg1)).then(function(items) {
            assert.lengthOf(items, arg2);
            callback();
        });
    });

    this.Then(/^I should see "(.*)"$/, function(arg1, callback) {
        var errCount = 0;
        var action = function() {
            driver.findElement(by.xpath('//*[text()="' + arg1 + '"]')).then(function(el) {
                callback();
            }, function(e) {
                if (errCount < 10) {
                    errCount += 1;
                    action();
                } else {
                    callback.fail('"' + arg1 + '" not found anywhere on the page');
                }
            });
        };

        action();
    });

    this.Then(/^I should not see "(.*)"$/, function(arg1, callback) {
        browser.findElements(by.xpath('//*[text()="' + arg1 + '"]')).then(function(el) {
            if (el.length === 0) {
                callback();
            } else {
                callback.fail('"' + arg1 + '" should not be seen');
            }
        }, function(e) {
            callback();
        });
    });

    this.Then(/^I should see the alert "([^"]*)"$/, function(arg1, callback) {
        driver.wait(function() {
            return driver.executeScript('return !!$(".alert").length;');
        }, 3000, 'Taking too long to find alert').then(function() {
            return browser.findElement(by.xpath('//div[text()="' + arg1 + '"]'));
        }).then(function(el) {
            // clean up alert
            return driver.executeScript('$(".alert").remove();');
        }).then(function() {
            callback();
        }, function() {
            callback.fail('alert with text "' + arg1 + '" not found');
        });
    });

    this.Then(/^model "([^"]*)" should be "([^"]*)"$/, function(arg1, arg2, callback) {
        var v = browser.element(by.model(arg1));
        v.getText(function(text) {
            if (text === arg2) {
                callback();
            } else {
                callback.fail('Expected "' + arg1 + '" to be "' + arg2 + '"');
            }
        });
    });

    this.Then(/^model "([^"]*)" should have length "([^"]*)"$/, function(arg1, arg2, callback) {
        ptor.findElement(by.model(arg1)).then(function(el) {
            if (el.length === arg2) {
                callback();
            } else {
                callback.fail('Expected "' + arg1 + '" to have length "' + arg2 + '"');
            }
        });
    });


    this.Then(/^the "([^"]*)" "([^"]*)" should equal "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
        driver.findElements(by.css(arg2)).then(function(elems) {
            return elems[utils.getIndex(arg1)];
        }).then(function(el) {
            return el.getText();
        }).then(function(text) {
            assert.equal(text, arg3);
            callback();
        });
    });

    this.Then(/^the "([^"]*)" "([^"]*)" input should equal "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
        browser.findElements(by.css(arg2)).then(function(elems) {
            return elems[utils.getIndex(arg1)];
        }).then(function(el) {
            return el.getAttribute('value');
        }).then(function(val) {
            assert.equal(val, arg3);
            callback();
        });
    });

    /**
     * Spec: ".some-element-class" should have text "Some text"
     *
     * @params {string} arg1 CSS selector
     * @params {string} arg2 Text to match
     */
    this.Then(/^"([^"]*)" should have text "([^"]*)"$/, function(arg1, arg2, callback) {
        driver.findElement(by.css(arg1)).then(function(el) {
            return el.getText();
        }).then(function(text) {
            assert.equal(text, arg2);
        }).then(callback);
    });

    this.Then(/^executing "([^"]*)" should return true$/, function(arg1, callback) {
        driver.wait(function() {
            return driver.executeScript('return ' + arg1 + ';');
        }, 5000, 'Taking too long to execute until true').then(function() {
            callback();
        });
    });

    /**
     * Find an element by index and verify its text
     *
     * Spec: Then the "first" ".list-item" should have text "something"
     *
     * @param {string} arg1 The elements index ie first, second, third, last
     * @param {string} arg2 CSS locator
     * @param {arg3}   arg3 The text to match
     */
    this.Then(/^the "([^"]*)" "([^"]*)" should have text "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
        driver.findElements(by.css(arg2)).then(function(elems) {
            return elems[utils.getIndex(arg1)];
        }).then(function(el) {
            return el.getText();
        }).then(function(text) {
            assert.equal(text, arg3);
            callback();
        }, function(e) {
            callback.fail(e.message);
        });
    });

    /**
     * Step: Then the "Name" input should equal "My Name"
     *
     * @params {string} arg1 The input selector [id, css selector, or label]
     * @params {string} arg2 The text to match
     */
    this.Then(/^the "([^"]*)" input should equal "([^"]*)"$/, function(arg1, arg2, callback) {
        utils.findInput(arg1).then(function(input) {
            return input.getAttribute('value');
        }).then(function(value) {
            assert.equal(value, arg2);
        }).then(callback);
    });

    this.Then(/^"([^"]*)" should be visible$/, function(arg1, callback) {
        browser.findElement(by.css(arg1)).then(function(elem) {
            callback();
        }).addErrback(function() {
            callback.fail(arg1 + ' not visible');
        });
    });

    this.Then(/^"([^"]*)" should have "([^"]*)" selected$/, function(arg1, arg2, callback) {
        var selectCount = 0,
            opts;

        if (arg1.match('^#')) {
            opts = driver.findElements(by.css(arg1 + ' option'));
        } else { //find by select name
            opts = driver.findElements(by.css('select[name="' + arg1 + '"] option'));
        }

        opts.then(function(elems) {
            elems.forEach(function(v, i) {
                v.getText().then(function(text) {
                    if (text === arg2) {
                        callback();
                    }
                });
            });
        });
    });

    this.Then(/^the "([^"]*)" "([^"]*)" should have "([^"]*)" selected$/, function(arg1, arg2, arg3, callback) {
        // express the regexp above with the code you wish you had
        callback.pending();
    });


    this.Then(/^the "([^"]*)" select should have "([^"]*)" chosen$/, function(arg1, arg2, callback) {
        driver.findElement(by.css('select[name="' + arg1 + '"]')).then(function(elem) {
            elem.getAttribute('id').then(function(id) {
                driver.findElement(by.css('#' + id + '_chosen .search-choice')).then(function(choice) {
                    choice.getText().then(function(text) {
                        assert.equal(text, arg2, 'option aint right');
                        callback();
                    });
                });
            });
        });
    });

    this.Then(/^the "([^"]*)" select should have "([^"]*)" and "([^"]*)" chosen$/, function(arg1, arg2, arg3, callback) {
        driver.findElement(by.css('select[name="' + arg1 + '"]')).then(function(elem) {
            elem.getAttribute('id').then(function(id) {
                driver.findElements(by.css('#' + id + '_chosen .search-choice')).then(function(choices) {
                    choices[0].getText().then(function(text1) {
                        assert.equal(text1, arg2, 'The first option aint right');
                        choices[1].getText().then(function(text2) {
                            assert(text2, arg3, 'The second option aint right');
                            callback();
                        });
                    });
                });
            });
        });
    });

    /**
     * Assert the pages title
     *
     * @param {string} arg1 The expected page title
     */
    this.Then(/^the page title should be "([^"]*)"$/, function(arg1, callback) {
        driver.wait(function() {
            return driver.executeScript('return (document.getElementsByTagName("title")[0] && document.getElementsByTagName("title")[0].innerHTML === "' + arg1 + '");');
        }, 10000, 'Taking too long to find title').then(function() {
            callback();
        });
    });

    /**
     * Assert an element exists on the page
     *
     * @param {string} id or CSS selector
     */
    this.Then(/^"([^"]*)" should exist$/, function(arg1, callback) {
        var action = function(_by) {
            browser.findElement(_by).then(function(el) {
                callback();
            }).addErrback(function(e) {
                callback.fail(e.message);
            });
        };

        if (arg1.match(/^#.*/)) { // find by id
            arg1 = arg1.replace('#', '');
            action(by.id(arg1));
        } else { // find by class
            action(by.css(arg1));
        }
    });

    /**
     * Assert an element does not exist on the page
     *
     * @param {string} id or CSS selector
     */
    this.Then(/^"([^"]*)" should not exist$/, function(arg1, callback) {
        var action = function(_by) {
            browser.findElement(_by).then(function(el) {
                callback.fail(arg1 + ' should not exist');
            }).addErrback(function(e) {
                callback();
            });
        };

        if (arg1.match(/^#.*/)) { // find by id
            arg1 = arg1.replace('#', '');
            action(by.id(arg1));
        } else { // find by class
            action(by.css(arg1));
        }
    });

    this.Given(/^I am logged in as "([^"]*)"$/, function(arg1, callback) {
        var users = db.get(models.users || 'users');

        users.findOne({
            firstName: arg1
        }).on('success', function(user) {
            if (!user) {
                callback.fail(arg1 + ' not found in user collection');
            }

            driver.get(baseUrl + '/login');
            driver.findElement(by.id('emailInput')).sendKeys(user.email);
            driver.findElement(by.id('passwordInput')).sendKeys('password');
            driver.findElement(by.tagName('button')).click().then(function() {
                return callback();
            });
        });
    });

    this.Given(/^I submit the form$/, function(callback) {
        return driver.findElement(by.css('button[type="submit"]')).click().then(function() {
            callback();
        });
    });

    /**
     * Fill in a text input or textarea with some text
     * @param string Matches either the inputs name attribute or its label text
     * @param string The text to input
     */
    this.Given(/^I fill in "([^"]*)" with "([^"]*)"$/, function(arg1, arg2, callback) {
        utils.findInput(arg1).then(function(input) {
            return input.clear().then(function() {
                return input.sendKeys(utils.resolveParameter(arg2)).then(function() {
                    return input.sendKeys(protractor.Key.TAB);
                });
            });
        }).then(callback);
    });


    /**
     * Select an option of a select element
     *
     * Step: Given I select "Some option text" from ".some-select-input"
     *
     * @params {string} arg1 The options text
     * @params {string} arg2 The selector [id, css selectors, label text]
     */
    this.Given(/^I select "([^"]*)" from "([^"]*)"$/, function(arg1, arg2, callback) {
        select(arg1, arg2, null, callback);
    });

    /**
     * Select an option of a select element by index
     *
     * @Spec: Given I select "Option Name" from the "first" ".select-input"
     *
     * @param {string} arg1 The options text
     * @param {string} arg2 The elements index
     * @param {string} arg3 The select elements css selector
     */
    this.Given(/^I select "([^"]*)" from the "([^"]*)" "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
        select(arg1, arg3, utils.getIndex(arg2), callback);
    });

    this.Given(/^I select "([^"]*)" and "([^"]*)" from "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
        var selectCount = 0,
            opts;

        if (arg3.match(/\..*/)) { // find by class
            opts = browser.findElements(by.css(arg3 + ' option'));
        } else { //find by select name
            opts = browser.findElements(by.css('select[name="' + arg3 + '"] option'));
        }

        opts.then(function(elems) {
            elems.forEach(function(v, i) {
                v.getText().then(function(text) {
                    if (text === arg1 || text === arg2) {
                        v.click().then(function() {
                            selectCount++;
                            if (selectCount === 2) {
                                callback();
                            }
                        });
                    }
                });
            });
        });
    });

    this.Given(/^I check "([^"]*)"$/, function(arg1, callback) {
        var action = function(_by) {
            browser.findElement(_by).then(function(el) {
                el.click().then(function() {
                    callback();
                }).addErrback(function(e) {
                    callback.fail(e.message);
                });
            }).addErrback(function(e) {
                callback.fail(e.message);
            });
        };

        if (arg1.match(/^#.*/)) { // find by id
            arg1 = arg1.replace('#', '');
            action(by.id(arg1));
        } else if (arg1.match(/\..*/)) { // find by class
            action(by.css(arg1));
        } else { // find by link text
            action(by.linkText(arg1));
        }
    });

    this.Given(/^I check the "([^"]*)" "([^"]*)"$/, function(arg1, arg2, callback) {
        var action = function(_by) {
            browser.findElements(_by).then(function(elems) {
                elems[utils.getIndex(arg1)].click().then(function() {
                    callback();
                }).addErrback(function(e) {
                    callback.fail(e.message);
                });
            }).addErrback(function(e) {
                callback.fail(e.message);
            });
        };

        action(by.css(arg2));
    });



    /**
     * Fill in an input by index
     *
     * Spec: Given I fill the "second" ".item" input with "foo"
     *
     * @param {string} arg1 The index in text format [first, second, third, last]
     * @param {string} arg2 The CSS selector
     * @param {string} arg3 The text to insert in the input
     */
    this.Then(/^I fill in the "([^"]*)" "([^"]*)" input with "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
        browser.findElements(by.css(arg2)).then(function(inputs) {
            return inputs[utils.getIndex(arg1)];
        }).then(function(input) {
            return input.clear().then(function() {
                return input.sendKeys(arg3).then(function() {
                    return input.sendKeys(protractor.Key.TAB);
                });
            });
        }).then(function() {
            callback();
        });
    });

    /**
     * Simulate a file upload
     * @param string   arg1 Matches either the inputs name attribute or its label text
     * @param string   arg1 The text to input
     * @param function callback
     */
    this.Given(/^I upload "([^"]*)" with "([^"]*)"$/, function(arg1, arg2, callback) {
        var action = function(input) {
            input.sendKeys(arg2).then(function() {
                callback();
            });
        };

        if (arg2.indexOf('%') !== -1) {
            arg2 = parameters[arg2.replace(/%/g, '')];
        }

        if (arg1.indexOf('#') !== -1) {
            arg1 = arg1.replace('#', '');
            driver.findElement(by.id(arg1)).then(function(input) {
                action(input);
            }).addErrback(function(e) {
                callback.fail(e.message);
            });
        } else {
            driver.findElement(by.xpath('//input[name="' + arg1 + '"]')).then(function(input) {
                action(input);
            }).addErrback(function(e) {
                driver.findElement(by.xpath('//label[text()="' + arg1 + '"]')).then(function(label) {
                    label.getAttribute('for').then(function(id) {
                        browser.findElement(by.id(id)).then(function(input) {
                            action(input);
                        });
                    });
                }).addErrback(function(e) {
                    callback.fail(e.message);
                });
            });
        }
    });

    this.Given(/^I choose "([^"]*)" and "([^"]*)" from "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
        browser.findElement(by.css('select[name="' + arg3 + '"]')).then(function(elem) {
            elem.getAttribute('id').then(function(id) {
                browser.findElement(by.id(id + '_chosen')).then(function(chosenContainer) {
                    chosenContainer.click().then(function() {
                        browser.findElement(by.xpath('//li[text()="' + arg1 + '"]')).then(function(option) {
                            option.click().then(function() {
                                chosenContainer.click().then(function() {
                                    browser.findElement(by.xpath('//li[text()="' + arg2 + '"]')).then(function(option) {
                                        option.click().then(function() {
                                            callback();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    this.Given(/^I am on "([^"]*)"$/, function(arg1, callback) {
        if (arg1.indexOf('www') === -1) {
            arg1 = baseUrl + '/' + arg1;
        }

        driver.get(arg1).then(function() {
            callback();
        });

    });

    this.Given(/^I wait$/, function(callback) {
        browser.sleep(500).then(function() {
            callback();
        });
    });

    /**
     * Wait for element
     */
    this.Given(/^I wait for "([^"]*)"$/, function(arg1, callback) {
        driver.wait(function() {
            return driver.executeScript('return ' + arg1 + ';');
        }, 5000, 'Taking too long to wait for ' + arg1).then(function() {
            callback();
        });
    });


    /**
     * Force an element to be visible
     */
    this.Given(/^I show "([^"]*)"$/, function(arg1, callback) {
        driver.executeScript('$("' + arg1 + '").removeClass("hide").css("opacity", 1).css("display", "block");').then(function() {
            callback();
        });
    });

    /**
     * Confirm a dialog
     */
    this.Given(/^I confirm$/, function(callback) {
        driver.wait(function() {
            return driver.executeScript('return !!$(".ez-confirm button").is(":visible");');
        }, 5000, 'Taking too long to find an confirm dialog').then(function() {
            driver.findElement(by.xpath('//div[contains(@class, \'ez-confirm\')]/descendant::button[text()="Yes"]')).then(function(elem) {
                elem.click().then(function() {
                    callback();
                }).addErrback(function(e) {
                    callback.fail('Unable to click Yes button');
                });
            }).addErrback(function(e) {
                callback.fail('Unable to find Yes button');
            });
        });
    });

    this.Given(/^I press "([^"]*)"$/, function(arg1, callback) {
        utils.findElement(arg1).then(function(button) {
            return button.click();
        }).then(callback);
    });

    /**
     * Click on an element with by id, class, or link text
     *
     * Usage: Given I click on "#someButton"
     * Usage: Given I click on ".some-button"
     * Usage: Given I click on "Hey Man"
     *
     * @param {string} arg1 The text to match
     */
    this.Given(/^I click on "([^"]*)"$/, function(arg1, callback) {
        utils.findElement(arg1).then(function(el) {
            return el.click();
        }).then(callback);
    });

    /**
     * Click on an element by index
     *
     * Usage: Given I click on the "first" ".list-button" element
     *
     * @param {string} arg1 The elements index
     * @param {string} arg2 The css locator
     */
    this.Given(/^I click on the "([^"]*)" "([^"]*)" element$/, function(arg1, arg2, callback) {
        utils.findElement(arg2, utils.getIndex(arg1)).then(function(el) {
            return el.click();
        }).then(callback);
    });

    /**
     * Click on a button by index
     *
     * Usage: Given I click on the "first" "Admin" button
     *
     * @param {string} arg1 The elements index
     * @param {string} arg2 The button text
     */
    this.Given(/^I click on the "([^"]*)" "([^"]*)" button$/, function(arg1, arg2, callback) {
        utils.findElement(utils.getIndex(arg1), arg2).then(function(el) {
            return el.click();
        }).then(callback);
    });

    /**
     * Follow an elements href attribute
     *
     * Usage: Given I follow "#someLink"
     *
     * @param {string} arg1 The elements id
     */
    this.Given(/^I follow "([^"]*)"$/, function(arg1, callback) {
        if (arg1.indexOf('#') !== -1) {
            arg1 = arg1.replace('#', '');
            driver.findElement(by.id(arg1)).then(function(el) {
                el.getAttribute('href').then(function(href) {
                    driver.get(href).then(function(v) {
                        callback();
                    });
                });
            }).addErrback(function(e) {
                callback.fail(e.message);
            });
        } else {
            callback.fail('TODO');
        }
    });
};