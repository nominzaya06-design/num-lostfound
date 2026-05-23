
export function MobileBottomNav() {
  return `
    <nav class="bottom-nav">
      <a href="#/" class="mobile-active">
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M21.4498 10.275L11.9998 3.1875L2.5498 10.275L2.9998 11.625H3.7498V20.25H20.2498V11.625H20.9998L21.4498 10.275ZM5.2498 18.75V10.125L11.9998 5.0625L18.7498 10.125V18.75H14.9999V14.3333L14.2499 13.5833H9.74988L8.99988 14.3333V18.75H5.2498ZM10.4999 18.75H13.4999V15.0833H10.4999V18.75Z" fill="#080341"/>
        </svg>
        <span>Home</span>
      </a>
      <a href="#/lost">
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.24223 4.5H17.7578L19.5 8.85556V18L18.75 18.75H5.25L4.5 18V8.85556L6.24223 4.5ZM7.25777 6L6.35777 8.25H17.6422L16.7422 6H7.25777ZM18 9.75H6V17.25H18V9.75ZM9.59473 13.6553L10.6554 12.5946L11.25 13.1892V11.25H12.75V13.1894L13.3447 12.5946L14.4054 13.6553L12.0001 16.0606L9.59473 13.6553Z" fill="#080341"/>
        </svg>
        <span>Lost</span>
      </a>
      <a href="#/found">
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M21 9.75H19.5V18.3107L18.3107 19.5H5.68934L4.5 18.3107L4.5 9.75H3V4.5H21V9.75ZM6 9.75L18 9.75V17.6893L17.6893 18H6.31066L6 17.6893L6 9.75ZM19.5 6V8.25L4.5 8.25L4.5 6L19.5 6ZM9.75 13.5H15V12H9.75V13.5Z" fill="#080341"/>
        </svg>
        <span>Found</span>
      </a>
      <a href="#/report">
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.25 12.75V18H12.75V12.75H18V11.25H12.75V6H11.25V11.25H6V12.75H11.25Z" fill="#080341"/>
        </svg>
        <span>Post</span>
      </a>
      <a href="#/profile">
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0603 18.307C14.89 19.0619 13.4962 19.5 12 19.5C10.5038 19.5 9.10996 19.0619 7.93972 18.307C8.66519 16.7938 10.2115 15.75 12 15.75C13.7886 15.75 15.3349 16.794 16.0603 18.307ZM17.2545 17.3516C16.2326 15.5027 14.2632 14.25 12 14.25C9.73663 14.25 7.76733 15.5029 6.74545 17.3516C5.3596 15.9907 4.5 14.0958 4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12C19.5 14.0958 18.6404 15.9908 17.2545 17.3516ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM12 12C13.2426 12 14.25 10.9926 14.25 9.75C14.25 8.50736 13.2426 7.5 12 7.5C10.7574 7.5 9.75 8.50736 9.75 9.75C9.75 10.9926 10.7574 12 12 12ZM12 13.5C14.0711 13.5 15.75 11.8211 15.75 9.75C15.75 7.67893 14.0711 6 12 6C9.92893 6 8.25 7.67893 8.25 9.75C8.25 11.8211 9.92893 13.5 12 13.5Z" fill="#080341"/>
        </svg>
        <span>Profile</span>
      </a>
    </nav>
  `;
}