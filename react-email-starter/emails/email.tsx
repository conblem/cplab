import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Section,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  userCorrect: number;
  userIncorrect: number;
  overallCorrect: number;
  overallIncorrect: number;
}

export function Email({
  userCorrect,
  userIncorrect,
  overallCorrect,
  overallIncorrect,
}: EmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container>
          <Section>
            <Link href="https://cplab.conblem.me/statistics">
              Your daily Statistics
            </Link>
          </Section>
          <Section>
            <table>
              <tbody>
                <tr>
                  <td>User Correct</td>
                  <td>{userCorrect}</td>
                </tr>
                <tr>
                  <td>User Incorrect</td>
                  <td>{userIncorrect}</td>
                </tr>
                <tr>
                  <td>Overall Correct</td>
                  <td>{overallCorrect}</td>
                </tr>
                <tr>
                  <td>Overall Incorrect</td>
                  <td>{overallIncorrect}</td>
                </tr>
              </tbody>
            </table>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
};

Email.PreviewProps = {
  userCorrect: 10,
  userIncorrect: 2,
  overallCorrect: 50,
  overallIncorrect: 20,
} as EmailProps;

export default Email;
