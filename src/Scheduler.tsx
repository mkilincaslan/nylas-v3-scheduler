import { useState } from "react";
import { NylasSchedulerEditor, NylasScheduling } from "@nylas/react";
import { NylasSchedulerConnectorInterface } from "@nylas/web-elements/dist/types/connector/connector-interface";
/*
 * Configuration for schedule editor. To know more about options see:
 * https://developer.nylas.com/docs/v3/scheduler/#choose-a-hosting-option-for-scheduling-pages
 */
const BlueCallBrandColor = "#2649FF";
const SCHEDULER_BASE_API_URL = "https://api.eu.nylas.com";
const CompanyLogoURL = "https://www.bluecallapp.com/assets/image-BdxxnILg.png";

const Scheduler = (): JSX.Element => {
  const clientId = import.meta.env.VITE_NYLAS_CLIENT_ID || "";

  const [appearance, setAppearance] = useState<
    undefined | { company_logo_url: string; company_name: string }
  >({
    company_logo_url: "",
    company_name: "",
  });
  const [guideMe, setGuideMe] = useState(false);

  /**
   * Get current path to determine from which route this component called
   * And return the proper component depends on the path
   * Editor for helpers or Scheduler for users
   */
  let currentPath = window.location.pathname;
  currentPath = currentPath.replace("/", "");

  if (!clientId || clientId === "") {
    return (
      <h3 style={{ marginTop: 12, color: "red" }}>
        Something went wrong please try again later. No clientId found
      </h3>
    );
  }

  // Get the configuration ID from the URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const configId = urlParams.get("config_id") || "";

  // Get form field values from query
  const name = urlParams.get("name") || "";
  const nickname = urlParams.get("nickname") || "";
  const email = urlParams.get("email") || "";
  const therapistName = urlParams.get("therapist_name") || "";
  const rescheduleBookingRef = urlParams.get("reschedule_booking_ref") || "";
  const cancelBookingRef = urlParams.get("cancel_booking_ref") || "";

  /* Identity settings of Nylas scheduler editor
   * https://developer.nylas.com/docs/v3/scheduler/configure-authentication/#download-nylas-identity-package
   */
  const identitySettings = {
    clientId,
    redirectUri: `${window.location.origin}/scheduler-editor`,
    domain: `${SCHEDULER_BASE_API_URL}/v3`, // or 'https://api.us.nylas.com/v3' for the U.S. data region
    hosted: true,
    accessType: "offline",
  };

  const GuideMe = () => (
    <iframe
      src="https://app.tango.us/app/embed/cd1ca3b3-6da6-440c-abfa-a16c3c1cc76c?skipCover=false&defaultListView=false&skipBranding=true"
      style={{ minHeight: 640 }}
      sandbox="allow-scripts allow-top-navigation-by-user-activation allow-popups allow-same-origin"
      security="restricted"
      title="BlueCall BackOffice Scheduler Setup Guide"
      width="100%"
      height="100%"
      // referrerpolicy='strict-origin-when-cross-origin'
      frameBorder="0"
      // web="webkitallowfullscreen"
      // mozallowfullscreen="mozallowfullscreen"
      allowFullScreen={true}
    ></iframe>
  );

  const handleGuideMe = () => {
    setGuideMe(!guideMe);
  };

  const Editor = () => (
    <div>
      {guideMe && <GuideMe />}
      <button
        type="button"
        onClick={handleGuideMe}
        style={{
          width: "100%",
          height: 40,
          marginTop: 16,
          marginBottom: 16,
          backgroundColor: "#2649FF",
          border: 0,
          borderRadius: 4,
          cursor: "pointer",
          color: "#fff",
        }}
      >
        {guideMe ? "Hide Guide" : "Show Guide"}
      </button>
      <br />
      <NylasSchedulerEditor
        configurationId={configId}
        schedulerPreviewLink={`${window.location.origin}/scheduler?config_id={config.id}`}
        nylasSessionsConfig={identitySettings}
        enableEventTypes={{
          one_on_one: true,
          collective: false,
          max_fairness: false,
          max_availability: false,
          group: false,
        }}
        defaultSchedulerConfigState={{
          selectedConfiguration: {
            scheduler: {
              min_cancellation_notice: 0,
              min_booking_notice: 0,
              hide_additional_guests: true,
              cancellation_policy: "",
              available_days_in_future: 60,
              hide_cancellation_options: true,
              hide_rescheduling_options: true,
              rescheduling_url: `${window.location.origin}/scheduler?reschedule_booking_ref=:booking_ref`, // The URL of the email notification includes the booking reference
              cancellation_url: `${window.location.origin}/scheduler?cancel_booking_ref=:booking_ref`,
              additional_fields: {
                nickname: {
                  label: "Nickname",
                  type: "text",
                },
              },
            },
            event_booking: {
              title: `${therapistName} - BlueCall Session`,
              location: "https://link.bluecallapp.com",
              description: "UserId: ${invitee}\n User Nickname: ${nickname}", // Populating the fields in the description of the event
            },
            availability: {
              availability_rules: {
                availability_method: "collective",
                buffer: {
                  after: 0,
                  before: 0,
                },
              },
              round_to: 60,
              duration_minutes: 45,
              interval_minutes: 60,
            },
            requires_session_auth: false, // Creates a public configuration which doesn't require a session
            appearance: {
              // company_name: 'BlueCall',
              company_logo_url: CompanyLogoURL,
              color: BlueCallBrandColor, // Color for dates in calendar when user is choosing days
              submit_button_label: "CONFIRM",
              thank_you_message: "Your session is booked!",
            },
          },
        }}
      />
    </div>
  );

  const Scheduling = () => (
    <div>
      {appearance && appearance.company_logo_url && (
        <img
          src={appearance.company_logo_url}
          alt={appearance?.company_name ?? "Company Logo"}
          width={200}
          style={{ marginBottom: 12, marginTop: 16 }}
        />
      )}
      <NylasScheduling
        mode="app"
        configurationId={configId}
        cancelBookingRef={cancelBookingRef}
        rescheduleBookingRef={rescheduleBookingRef}
        schedulerApiUrl={SCHEDULER_BASE_API_URL}
        eventOverrides={{
          configSettingsLoaded: async (
            event,
            _: NylasSchedulerConnectorInterface | undefined
          ) => {
            const { settings } = event.detail;

            if (!settings.data.appearance) {
              setAppearance(undefined);
              return;
            }

            setAppearance({
              ...settings.data.appearance,
              company_logo_url: CompanyLogoURL,
            });
          },
        }}
        localization={{
          en: {
            bookNowButton: "CONFIRM",
          },
          sv: {
            bookNowButton: "BEKRÄFTA",
          },
        }}
        bookingInfo={{
          primaryParticipant: {
            name,
            email,
          },
          additionalFields: {
            nickname: {
              value: nickname,
              type: "string",
            },
          },
        }}
        defaultSchedulerState={
          {
            // showBookingForm: false,
          }
        }
        nylasBranding={false}
        enableUserFeedback={false}
      />
    </div>
  );

  // Return the component depends on the current path
  return currentPath === "scheduler" ? Scheduling() : Editor();
};

export default Scheduler;
