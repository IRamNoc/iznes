# Message with links

## Usages:
The message type is a type of action message.
1. Inject message service.
2. Use `sendMessage` method.

## Structure of the message
Below is an example of the data need to send into the `sendMessage` method.
```
sendMessage(<recipientArr>, <subjectStr>, <bodyStr>, <action>)
```

- `recipientArr`: array of recipients
- `subjectStr`: Subject of the message
- `bodyStr`: body of the link message. note that, the `bodyStr` is used for this action message. example of `bodyStr`
```typescript
'message content with %@link@%, and you can also have multiple %@link@%'
```

- `action`: json of with the following structure:
```typescript
{
   type: 'messageWithLink'; 
   data: {
            links: {link: string; anchorCss: string; anchorText: string}[];
         }
   };
}
```



