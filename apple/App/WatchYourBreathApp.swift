// Watch Your Breath for iPhone, iPad and Mac. The app is where the reminders
// come from on Apple devices; it also carries the Safari extension.

import SwiftUI
import UserNotifications
#if os(iOS)
import BackgroundTasks
#endif

@main
struct WatchYourBreathApp: App {
    @StateObject private var model = AppModel.shared
    @Environment(\.scenePhase) private var scenePhase

    /// Listed under BGTaskSchedulerPermittedIdentifiers in project.yml.
    static let refreshTaskId = "dev.sakshipatil.WatchYourBreath.refresh"

    init() {
        Typeface.register()
        UNUserNotificationCenter.current().delegate = NotificationDelegate.shared
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(model)
                .preferredColorScheme(.light) // the drawings live on sand, never on dark
                #if os(macOS)
                .frame(minWidth: 380, idealWidth: 420, minHeight: 560, idealHeight: 720)
                #endif
        }
        #if os(macOS)
        .windowResizability(.contentSize)
        #endif
        .onChange(of: scenePhase) { _, phase in
            switch phase {
            case .active: model.refresh()
            #if os(iOS)
            case .background: Self.scheduleBackgroundRefresh()
            #endif
            default: break
            }
        }
        #if os(iOS)
        // iOS wakes the app now and then to top up the reminders it has handed over
        .backgroundTask(.appRefresh(Self.refreshTaskId)) {
            await ReminderCenter.refresh()
            Self.scheduleBackgroundRefresh()
        }
        #endif
    }

    #if os(iOS)
    static func scheduleBackgroundRefresh() {
        let request = BGAppRefreshTaskRequest(identifier: refreshTaskId)
        request.earliestBeginDate = Date().addingTimeInterval(6 * 3600)
        try? BGTaskScheduler.shared.submit(request)
    }
    #endif
}

struct RootView: View {
    @EnvironmentObject private var model: AppModel

    var body: some View {
        ZStack {
            Palette.clay.ignoresSafeArea() // the desk the sticker rests on
            if model.settings.onboarded {
                NavigationStack { HomeView() }
            } else {
                OnboardingView()
            }
        }
        .tint(Palette.rustDeep)
        .sheet(item: $model.opened) { ReminderView(reminder: $0) }
    }
}
