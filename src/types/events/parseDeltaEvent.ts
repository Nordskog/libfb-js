import {
    ParticipantLeftGroupThreadEvent,
    ParticipantsAddedToGroupThreadEvent,
    ThreadNameEvent
} from './ThreadEvents'
import {
    Event,
    DeliveryReceiptEvent,
    ReadReceiptEvent,
    EventType
} from '../Events'
import parseAdminMessage from './parseAdminMessage'

export default function parseDeltaEvent (event: any): { type: EventType, event: Event } {
  if (event.deltaAdminTextMessage) return parseAdminMessage(event.deltaAdminTextMessage)

  if (event.deltaThreadName) {
    const delta = event.deltaThreadName
    return {
      type: 'threadNameEvent',
      event: {
        ...this.getEventMetadata(delta),
        name: delta.name
      } as ThreadNameEvent
    }
  }

  if (event.deltaDeliveryReceipt) {
    const delta = event.deltaDeliveryReceipt
    return {
      type: 'deliveryReceiptEvent',
      event: {
        threadId: this.getThreadId(delta),
        receiverId: delta.actorFbId || this.getThreadId(delta)
      } as DeliveryReceiptEvent
    }
  }

  if (event.deltaReadReceipt) {
    const delta = event.deltaReadReceipt
    return {
      type: 'readReceiptEvent',
      event: {
        threadId: this.getThreadId(delta),
        receiverId: delta.actorFbId || this.getThreadId(delta)
      } as ReadReceiptEvent
    }
  }

  if (event.deltaParticipantsAddedToGroupThread) {
    const delta = event.deltaParticipantsAddedToGroupThread
    return {
      type: 'participantsAddedToGroupThreadEvent',
      event: {
        ...getEventMetadata(delta),
        participantIds: delta.addedParticipants.map(user => user.userFbId)
      } as ParticipantsAddedToGroupThreadEvent
    }
  }

  if (event.deltaParticipantLeftGroupThread) {
    const delta = event.deltaParticipantLeftGroupThread
    return {
      type: 'participantLeftGroupThreadEvent',
      event: {
        ...getEventMetadata(delta),
        participantId: delta.leftParticipantFbId
      } as ParticipantLeftGroupThreadEvent
    }
  }
}
export function getEventMetadata (delta: any) {
  return {
    id: delta.messageMetadata.messageId,
    threadId: this.getThreadId(delta),
    authorId: delta.messageMetadata.actorFbId,
    message: delta.messageMetadata.adminText
  }
}
