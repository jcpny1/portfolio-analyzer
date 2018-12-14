require 'rails_helper'

RSpec.feature 'Portfolio Management', js: true, :type => :feature do
  # if !ENV['TRAVIS']
    scenario 'User creates a portfolio' do
      visit 'http://localhost:3001'
      page.first('#portfolioEdit').click
      fill_in "Name", :with => '<do-not-use>'
      click_button 'Submit'
      expect(page).to have_text('<do-not-use>')
    end
    #
    # scenario 'User deletes a portfolio' do
    #   visit 'http://127.0.0.1:3000'
    #   page.first('#portfolioDelete').click
    #   click_button 'YES'
    #   expect(page).not_to have_text(' <do-not-use>')
    # end
  # end
end
