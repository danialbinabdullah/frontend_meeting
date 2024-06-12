
##############################


import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from lxml import html
import time

def scrape_meetings():
    # Set up Selenium WebDriver
    driver = webdriver.Chrome()

    # URL of the website
    url = "https://mauicounty.legistar.com/Calendar.aspx"
    driver.get(url)

    # Wait for the page to load and the dropdown to be clickable
    wait = WebDriverWait(driver, 10)
    dropdown = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="ctl00_ContentPlaceHolder1_lstYears_Arrow"]')))

    # Change the dropdown option to "All Years"
    dropdown.click()
    all_years_option = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="ctl00_ContentPlaceHolder1_lstYears_DropDown"]/div/ul/li[1]')))
    all_years_option.click()
    
    # Wait for the page to reload with all the data
    time.sleep(5)  # Adjust this sleep time if necessary for the page to load completely

    # Parse the HTML content using lxml
    tree = html.fromstring(driver.page_source)

    # XPath of the whole table
    table_xpath = '//*[@id="ctl00_ContentPlaceHolder1_gridCalendar_ctl00"]'

    # Extract rows of the table, skipping header and footer rows
    rows = tree.xpath(f"{table_xpath}//tr[contains(@id, 'ctl00_ContentPlaceHolder1_gridCalendar_ctl00__')]")

    # Function to extract text using XPath and handle missing elements
    def extract_text(row, xpath):
        elements = row.xpath(xpath)
        return elements[0].text_content().strip() if elements else ""

    # Iterate through each row and extract details
    meetings = []
    for i, row in enumerate(rows, start=1):
        meeting = {
            "id": i,
            "title": extract_text(row, ".//td[1]"),
            "date": extract_text(row, ".//td[2]"),
            "time": extract_text(row, ".//td[4]"),
            "status": "Concluded"
        }
        video_link_element = row.xpath(".//td[8]//a")
        meeting['video_link'] = video_link_element[0].get("href") if video_link_element else None
        meetings.append(meeting)

    # Close the Selenium driver
    driver.quit()

    # Save the data to a JSON file
    with open('meetings.json', 'w') as f:
        json.dump(meetings, f, indent=4)

# Run the scraper
scrape_meetings()

