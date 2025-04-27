import { useRef,useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../../util/http';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorBlock from '../UI/ErrorBlock';
import EventItem from './EventItem';

export default function FindEventSection() {
  const searchElement = useRef();
  //reaact query by default passes some default data to query function ,and the data that is passed contains some info like querykey , metdata ,signal : required for aborting that request if you navigate away from this page .React query is capable of aborting requests and for that it gives signal 
  const [searchTerm,setSearchTerm]=useState();

  const {data,isLoading , isError , error}=useQuery({
    queryKey:['events',{search:searchTerm }],
    queryFn:({signal})=>fetchEvents({searchTerm,signal}),
    enabled:!!searchTerm


  })

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  let content =  <p>Please enter a search term and to find events.</p>
  if(isLoading)
  {
    content = <LoadingIndicator/>
  }
  if(isError)
  {
    content = <ErrorBlock title="Error occurred" message={error.info?.message || "Failed to fetch events"}/>

  }

  if(data)
  {
    content = <ul>
      {
        data?.map((event)=><li key={event.id}><EventItem event={event}/></li>)
      }
    </ul>
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
     
    </section>
  );
}
