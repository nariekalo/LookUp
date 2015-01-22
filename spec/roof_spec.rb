require 'spec_helper'

describe Roof do

  def submit_material 
    visit '/material'
    choose('tiles')
    click_on "Next"
  end

  before do
    submit_material
  end

  context 'Roof material' do

    it "creates a record in the database" do
      expect { submit_material }.to change { Roof.count }.by 1
    end

    it "knows the material that the roof is made out of" do
      expect(Roof.first.material).to eq "tiles"
    end

  end

  context 'Shading value' do

    it 'holds the specific shade value set by the user' do
      visit '/shading'
      fill_in "shade_value", with: "1"
      click_on "Next"
      expect(Roof.first.shade_value).to eq 1
    end

  end

  context 'Roof angle' do

    it 'records a 90 degree angle for flat roofs' do
      visit '/roof_angle'
      click_on 'Flat'
      expect(Roof.first.roof_angle).to eq 90
    end

    it 'records the specific angle of the roof if it is sloped' do
      visit '/sloped_roof'
      click_on 'Capture'
      expect(Roof.first.roof_angle).to eq 0
    end

  end

end

