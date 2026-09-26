/* The 4else mark (the navy leaf with "4e", the website's favicon) as the
   Studio's logo in the top bar and on the login screen. The file comes
   from static/, which the Studio serves at /static/. */
export function StudioIcon() {
  return (
    <img
      src="/static/favicon-192.png"
      alt=""
      width={25}
      height={25}
      style={{display: 'block', width: '100%', height: '100%', objectFit: 'contain'}}
    />
  )
}
