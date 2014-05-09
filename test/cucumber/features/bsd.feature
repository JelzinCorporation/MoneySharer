Feature: Running Cucumber with Protractor
  As a user of Protractor
  I should be able to use Cucumber
  to run my E2E tests

  Scenario: Running Cucumber with Protractor
    Given I wait
    Then it should still do normal tests
    Then it should expose the correct global variables

  Scenario: shit
    Given I wait
    Then I am on "http://www.google.de"