export const sendCrossFrameEvent = (appName: string, eventType: string) => {
  const targets = []
  const splitReferrer = window.document.referrer.split('/')
  const splitProtocol = splitReferrer[0]
  const referrerHost = splitReferrer[2]
  targets.push(`${splitProtocol}//${referrerHost}`)
  targets.push(window.location.ancestorOrigins[0])
  // Remove urls w/ this origin
  const i = targets.indexOf(window.location.origin)
  if (i !== -1) {
    targets.splice(i, 1)
  }
  // Remove duplicates
  if (targets.length > 1 && targets[0] === targets[1]) {
    targets.splice(1, 1)
  }
  for (let j = 0; j < targets.length; j++) {
    try {
      top.postMessage(
        JSON.stringify({
          app: appName,
          event: eventType,
          url: window.location.href,
        }),
        targets[j]
      )
    } catch (err) {
      // Ignore accidental or bad requests
    }
  }
}

export interface CrossFrameMessage {
  event: string
  url: string
  app: string
}
