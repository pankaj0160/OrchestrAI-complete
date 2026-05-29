import os
from dotenv import load_dotenv
load_dotenv()
from agents import run_search_agent, run_reader_agent

topic = 'Climate tech innovations'
print('Running search...')
search_res = run_search_agent(topic)
print('Search results snippet:\n', search_res[:800])
print('\nRunning reader...')
try:
    reader_res = run_reader_agent(topic, search_res)
    print('Reader output snippet:\n', reader_res[:800])
except Exception as e:
    import traceback; traceback.print_exc()
